/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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
import { CreatePlanDto } from '../dto/plans/create-plan.dto';
import { ListQueryPlansDto } from '../dto/plans/list-plan.dto';
import { UpdatePlanDto } from '../dto/plans/update-plan.dto';
import { Plan } from '../entities/plan.entity';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan)
    private readonly plansRepository: Repository<Plan>,
    private readonly webhooksService: WebhooksService,
    private readonly cacheManagerService: CacheManagerService,
  ) {}

  async createPlan({
    request,
    createPlanData,
  }: {
    request: Request;
    createPlanData: CreatePlanDto;
  }): Promise<ApiResponseModel<Plan>> {
    try {
      //Verified Uniquness of plan within the user
      await this.#isPlanNameIsUnique({
        name: createPlanData?.name,
      });

      const newPlan = this.plansRepository.create({
        ...createPlanData,
      });
      const data = await this.plansRepository.save(newPlan);

      // INFO: Initiate webhook sender on `plan:created` event
      this.webhooksService.prepareToSendWebhooks({
        user: (request?.['user'] as AuthUserPayload)?.id,
        event: WebhookEventEnum.PlanCreated,
        payload: data as Record<string, unknown>,
      });

      return {
        data,
        metadata: { body: createPlanData },
        message: 'Plan created successfully',
      };
    } catch (error) {
      Logger.error(`Error in create plan: ${(error as ApiErrorResponse).message}`);
      throw error as ApiErrorResponse;
    }
  }

  async findAllPlans({
    request,
    listQueryPlansData,
  }: {
    request: Request;
    listQueryPlansData?: ListQueryPlansDto;
  }): Promise<ApiResponseModel<Plan[]>> {
    try {
      // From Cache
      let data = await this.cacheManagerService.cacheGetData(request);
      if (!isMissing(data)) {
        return {
          data,
          metadata: { query: listQueryPlansData },
        } as ApiResponseModel<Plan[]>;
      }

      // Not From Cache
      const { skip, take } = getPagination(listQueryPlansData);

      data = (await this.plansRepository.find({
        where: listQueryPlansData,
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
        metadata: { query: listQueryPlansData },
      };
    } catch (error) {
      Logger.error(`Error in list plan: ${(error as ApiErrorResponse).message}`);
      throw (error as ApiErrorResponse).message;
    }
  }

  async findOnePlan({
    request,
    id,
    query,
  }: {
    request: Request;
    id: string;
    query?: ApiQueryParamUnifiedModel;
  }): Promise<ApiResponseModel<Plan>> {
    // From Cache
    let data = await this.cacheManagerService.cacheGetData(request);
    if (!isMissing(data)) {
      return {
        data,
        metadata: { query },
      } as ApiResponseModel<Plan>;
    }

    // Not From Cache
    data = (await this.plansRepository.findOne({
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

  async updatePlan({
    request,
    id,
    updatePlanData,
  }: {
    request: Request;
    id: string;
    updatePlanData: UpdatePlanDto;
  }): Promise<ApiResponseModel<Plan>> {
    //Verified Uniquness of plan within the user
    if (!isMissing(updatePlanData?.name)) {
      await this.#isPlanNameIsUnique({
        name: updatePlanData?.name,
      });
    }

    //Actual user update
    const updated = await this.plansRepository.update(id, {
      ...updatePlanData,
    });
    if (!updated?.affected) {
      throw new BadRequestException(`Not updated`);
    }
    //Get updated user
    const data = await this.plansRepository.findOneBy({
      id,
    });

    // INFO: Initiate webhook sender on `plan:updated` event
    this.webhooksService.prepareToSendWebhooks({
      user: (request?.['user'] as AuthUserPayload)?.id,
      event: WebhookEventEnum.PlanUpdated,
      payload: data as Record<string, unknown>,
    });

    return {
      data,
      metadata: {
        params: { id },
        body: updatePlanData,
      },
      message: 'Plan updated successfully',
    };
  }

  async removePlan({
    request,
    id,
  }: {
    request: Request;
    id: string;
  }): Promise<ApiResponseModel<Plan>> {
    const deleted = await this.plansRepository.update(id, {
      isDeleted: true,
      isEnabled: false,
    });
    if (!deleted?.affected) {
      throw new BadRequestException(`Not deleted`);
    }
    //Get deleted user
    const data = await this.plansRepository.findOneBy({
      id,
    });

    // INFO: Initiate webhook sender on `plan:deleted` event
    this.webhooksService.prepareToSendWebhooks({
      user: (request?.['user'] as AuthUserPayload)?.id,
      event: WebhookEventEnum.PlanDeleted,
      payload: data as Record<string, unknown>,
    });

    return {
      data,
      metadata: { params: { id } },
      message: 'Plan deleted successfully',
    };
  }

  async findPlanByValue(query: Record<string, unknown>): Promise<boolean> {
    try {
      const data = await this.plansRepository.findOne({
        where: { ...query },
      });
      if (isMissing(data)) {
        return false;
      }
      return true;
    } catch (error) {
      Logger.error(`Error in plan operation: ${(error as ApiErrorResponse).message}`);
      return true;
    }
  }

  #isPlanNameIsUnique = async ({ name }: { name?: string }) => {
    const isNameUnique = await this.findPlanByValue({
      name,
    });
    if (isNameUnique) {
      throw new ConflictException(`Name should be unique`);
    }
    return true;
  };
}
