import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getPagination } from '../../core/helpers/serializers';
import { isMissing } from '../../core/helpers/validations';
import { ApiErrorResponse } from '../../core/modules/activity-logs/utils/types';
import { AuthUserPayload } from '../../core/modules/auth/types';
import { CacheManagerService } from '../../core/modules/cache-manager/cache-manager.service';
import { WebhookEventEnum } from '../../core/modules/webhooks/enums';
import { WebhooksService } from '../../core/modules/webhooks/webhooks.service';
import { OrderEnum } from '../../core/shared/enums';
import { ApiResponseModel } from '../../core/shared/interfaces/api-response.interface';
import { ApiQueryParamUnifiedModel } from '../../core/shared/models/api-query.model';
import { CreateProviderFieldAssociationDto } from './dtos/create-provider_field_association.dto';
import { ListQueryProviderFieldAssociationsDto } from './dtos/list-provider_field_association.dto';
import { UpdateProviderFieldAssociationDto } from './dtos/update-provider_field_association.dto';
import { ProviderFieldAssociation } from './entities/provider_field_association.entity';

@Injectable()
export class ProviderFieldAssociationsService {
  constructor(
    @InjectRepository(ProviderFieldAssociation)
    private readonly providerFieldAssociationsRepository: Repository<ProviderFieldAssociation>,
    private readonly webhooksService: WebhooksService,
    private readonly cacheManagerService: CacheManagerService,
  ) {}

  async createProviderFieldAssociation({
    request,
    createProviderFieldAssociationData,
  }: {
    request: Request;
    createProviderFieldAssociationData: CreateProviderFieldAssociationDto;
  }): Promise<ApiResponseModel<ProviderFieldAssociation>> {
    try {
      const newProviderFieldAssociation = this.providerFieldAssociationsRepository.create({
        ...createProviderFieldAssociationData,
        addedBy: (request?.['user'] as AuthUserPayload)?.id,
      });
      const data = await this.providerFieldAssociationsRepository.save(newProviderFieldAssociation);

      // INFO: Initiate webhook sender on `fieldAssociation:created` event
      this.webhooksService.prepareToSendWebhooks({
        user: (request?.['user'] as AuthUserPayload)?.id,
        event: WebhookEventEnum.FieldAssociationCreated,
        payload: data as Record<string, unknown>,
      });

      return {
        data,
        metadata: { body: createProviderFieldAssociationData },
        message: 'ProviderFieldAssociation created successfully',
      };
    } catch (error) {
      Logger.error(
        `Error in create provider field association: ${(error as ApiErrorResponse).message}`,
      );
      throw (error as ApiErrorResponse).message;
    }
  }

  async findAllProviderFieldAssociations({
    request,
    listQueryProviderFieldAssociationsData,
  }: {
    request: Request;
    listQueryProviderFieldAssociationsData?: ListQueryProviderFieldAssociationsDto;
  }): Promise<ApiResponseModel<ProviderFieldAssociation[]>> {
    try {
      // From Cache
      let data = await this.cacheManagerService.cacheGetData(request);
      if (!isMissing(data)) {
        return {
          data,
          metadata: { query: listQueryProviderFieldAssociationsData },
        } as ApiResponseModel<ProviderFieldAssociation[]>;
      }

      // Not From Cache
      const { skip, take, relations } = getPagination(listQueryProviderFieldAssociationsData);

      data = (await this.providerFieldAssociationsRepository.find({
        where: listQueryProviderFieldAssociationsData,
        relations: relations && ['provider', 'customField', 'addedBy'],
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
        metadata: { query: listQueryProviderFieldAssociationsData },
      };
    } catch (error) {
      Logger.error(
        `Error in list provider field association: ${(error as ApiErrorResponse).message}`,
      );
      throw (error as ApiErrorResponse).message;
    }
  }

  async findOneProviderFieldAssociation({
    request,
    id,
    query,
  }: {
    request: Request;
    id: string;
    query?: ApiQueryParamUnifiedModel;
  }): Promise<ApiResponseModel<ProviderFieldAssociation>> {
    // From Cache
    let data = await this.cacheManagerService.cacheGetData(request);
    if (!isMissing(data)) {
      return {
        data,
        metadata: { query },
      } as ApiResponseModel<ProviderFieldAssociation>;
    }

    // Not From Cache
    const { relations } = getPagination(query);

    data = (await this.providerFieldAssociationsRepository.findOne({
      where: { id },
      relations: relations && ['provider', 'customField', 'addedBy'],
    })) as Record<string, unknown>;

    if (isMissing(data)) {
      throw new NotFoundException(`Record not found with id: ${id}`);
    }

    // Set in Cache
    await this.cacheManagerService.cacheSetData({
      request,
      data,
    });

    return { data, metadata: { params: { id } } };
  }

  async updateProviderFieldAssociation({
    request,
    id,
    updateProviderFieldAssociationData,
  }: {
    request: Request;
    id: string;
    updateProviderFieldAssociationData: UpdateProviderFieldAssociationDto;
  }): Promise<ApiResponseModel<ProviderFieldAssociation>> {
    //Actual provider field association update
    const updated = await this.providerFieldAssociationsRepository.update(
      id,
      updateProviderFieldAssociationData,
    );
    if (!updated?.affected) {
      throw new BadRequestException(`Not updated`);
    }
    //Get updated provider field association
    const data = await this.providerFieldAssociationsRepository.findOneBy({
      id,
    });

    // INFO: Initiate webhook sender on `fieldAssociation:updated` event
    this.webhooksService.prepareToSendWebhooks({
      user: (request?.['user'] as AuthUserPayload)?.id,
      event: WebhookEventEnum.FieldAssociationUpdated,
      payload: data as Record<string, unknown>,
    });

    return {
      data,
      metadata: {
        params: { id },
        body: updateProviderFieldAssociationData,
      },
      message: 'ProviderFieldAssociation updated successfully',
    };
  }

  async removeProviderFieldAssociation({
    request,
    id,
  }: {
    request: Request;
    id: string;
  }): Promise<ApiResponseModel<ProviderFieldAssociation>> {
    const deleted = await this.providerFieldAssociationsRepository.delete(id);
    if (!deleted?.affected) throw new BadRequestException(`Not deleted`);

    // INFO: Initiate webhook sender on `fieldAssociation:deleted` event
    this.webhooksService.prepareToSendWebhooks({
      user: (request?.['user'] as AuthUserPayload)?.id,
      event: WebhookEventEnum.FieldAssociationDeleted,
      payload: { id },
    });

    return {
      message: 'ProviderFieldAssociation deleted successfully',
    };
  }

  async findProviderFieldAssociationByValue(query: Record<string, unknown>): Promise<boolean> {
    try {
      const data = await this.providerFieldAssociationsRepository.findOne({
        where: { ...query },
      });
      if (isMissing(data)) {
        return false;
      }
      return true;
    } catch (error) {
      Logger.error(
        `Error in provider field association operation: ${(error as ApiErrorResponse).message}`,
      );
      return false;
    }
  }
}
