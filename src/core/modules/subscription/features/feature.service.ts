import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getPagination } from '../../../helpers/serializers';
import { isMissing } from '../../../helpers/validations';
import { OrderEnum } from '../../../shared/enums';
import { ApiResponseModel } from '../../../shared/interfaces/api-response.interface';
import { ApiQueryParamUnifiedModel } from '../../../shared/models/api-query.model';
import { ApiErrorResponse } from '../../activity-logs/utils/types';
import { AuthUserPayload } from '../../auth/types';
import { CacheManagerService } from '../../cache-manager/cache-manager.service';
import { WebhookEventEnum } from '../../webhooks/enums';
import { WebhooksService } from '../../webhooks/webhooks.service';
import { CreateFeatureDto } from '../dto/features/create.feature.dto';
import { ListQueryFeaturesDto } from '../dto/features/list.feature.dto';
import { Feature } from '../entities/feature.entity';

@Injectable()
export class FeaturesServcie {
  constructor(
    @InjectRepository(Feature)
    private readonly featuresRepository: Repository<Feature>,
    private readonly webhooksService: WebhooksService,
    private readonly cacheManagerService: CacheManagerService,
  ) {}

  async createFeature({
    request,
    createFeatureData,
  }: {
    request: Request;
    createFeatureData: CreateFeatureDto;
  }): Promise<ApiResponseModel<Feature>> {
    try {
      //Verified Uniquness of feature within the user
      await this.#isFeatureNameIsUnique({
        name: createFeatureData?.name,
      });

      const newFeature = this.featuresRepository.create({
        ...createFeatureData,
      });
      const data = await this.featuresRepository.save(newFeature);

      // INFO: Initiate webhook sender on `feature:created` event
      this.webhooksService.prepareToSendWebhooks({
        user: (request?.['user'] as AuthUserPayload)?.id,
        event: WebhookEventEnum.FeatureCreated,
        payload: data as Record<string, unknown>,
      });

      return {
        data,
        metadata: { body: createFeatureData },
        message: 'Feature created successfully',
      };
    } catch (error) {
      Logger.error(`Error in create feature: ${(error as ApiErrorResponse).message}`);
      throw error as ApiErrorResponse;
    }
  }

  async findAllFeatures({
    request,
    listQueryFeaturesData,
  }: {
    request: Request;
    listQueryFeaturesData?: ListQueryFeaturesDto;
  }): Promise<ApiResponseModel<Feature[]>> {
    try {
      // From Cache
      let data = await this.cacheManagerService.cacheGetData(request);
      if (!isMissing(data)) {
        return {
          data,
          metadata: { query: listQueryFeaturesData },
        } as ApiResponseModel<Feature[]>;
      }

      // Not From Cache
      const { skip, take } = getPagination(listQueryFeaturesData);

      data = (await this.featuresRepository.find({
        where: listQueryFeaturesData,
        skip,
        take,
        order: { updatedAt: OrderEnum.DESC },
      })) as Record<string, unknown>[];

      // Set in Cache
      await this.cacheManagerService.cacheSetData({
        request,
        data,
      });

      return {
        data,
        metadata: { query: listQueryFeaturesData },
      };
    } catch (error) {
      Logger.error(`Error in list feature: ${(error as ApiErrorResponse).message}`);
      throw (error as ApiErrorResponse).message;
    }
  }

  async findOneFeature({
    request,
    id,
    query,
  }: {
    request: Request;
    id: string;
    query?: ApiQueryParamUnifiedModel;
  }): Promise<ApiResponseModel<Feature>> {
    // From Cache
    let data = await this.cacheManagerService.cacheGetData(request);
    if (!isMissing(data)) {
      return {
        data,
        metadata: { query },
      } as ApiResponseModel<Feature>;
    }

    // Not From Cache
    data = (await this.featuresRepository.findOne({
      where: { id },
    })) as Record<string, unknown>;

    if (isMissing(data)) {
      throw new NotFoundException(`Record not found with id: ${id}`);
    }

    // Set in Cache
    await this.cacheManagerService.cacheSetData({
      request,
      data,
    });

    return { data, metadata: { query } };
  }

  async findFeatureByValue(query: Record<string, unknown>): Promise<boolean> {
    try {
      const data = await this.featuresRepository.findOne({
        where: { ...query },
      });
      if (isMissing(data)) {
        return false;
      }
      return true;
    } catch (error) {
      Logger.error(`Error in feature operation: ${(error as ApiErrorResponse).message}`);
      return true;
    }
  }

  #isFeatureNameIsUnique = async ({ name }: { name?: string }) => {
    const isNameUnique = await this.findFeatureByValue({
      name,
    });
    if (isNameUnique) {
      throw new ConflictException(`Name should be unique`);
    }
    return true;
  };
}
