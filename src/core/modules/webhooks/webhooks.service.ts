import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { getPagination } from '../../helpers/serializers';
import { isMissing } from '../../helpers/validations';
import { OrderEnum } from '../../shared/enums';
import { ApiResponseModel } from '../../shared/interfaces/api-response.interface';
import { ApiQueryParamUnifiedModel } from '../../shared/models/api-query.model';
import { ApiErrorResponse } from '../activity-logs/utils/types';
import { AuthUserPayload } from '../auth/types';
import { CacheManagerService } from '../cache-manager/cache-manager.service';
import { CreateWebhookDto } from './dtos/create-webhook.dto';
import { ListQueryWebhooksDto } from './dtos/list-webhook.dto';
import { UpdateWebhookDto } from './dtos/update-webhook.dto';
import { Webhook } from './entities/webhook.entity';
import { WebhookEventEnum, WebhookStatusEnum } from './enums';
import { evaluateNextTriggerDateTime } from './utils';
import { WebhookHistoriesService } from './webhook_history.service';

@Injectable()
export class WebhooksService {
  constructor(
    @InjectRepository(Webhook)
    private readonly webhooksRepository: Repository<Webhook>,
    private readonly webhookHistoriesService: WebhookHistoriesService,
    private readonly cacheManagerService: CacheManagerService,
  ) {}

  async createWebhook({
    request,
    CreateWebhookData,
  }: {
    request: Request;
    CreateWebhookData: CreateWebhookDto;
  }): Promise<ApiResponseModel<Webhook>> {
    try {
      //Verified Uniquness of webhook within the user
      await this.#isWebhookIsUnique({
        event: CreateWebhookData?.event,
        user: (request?.['user'] as AuthUserPayload as AuthUserPayload)?.id,
      });

      const newWebhook = this.webhooksRepository.create({
        ...CreateWebhookData,
        user: (request?.['user'] as AuthUserPayload as AuthUserPayload)?.id,
      });
      const data = await this.webhooksRepository.save(newWebhook);
      return {
        data,
        metadata: { body: CreateWebhookData },
        message: 'Webhook created successfully',
      };
    } catch (error) {
      Logger.error(`Error in create webhook: ${(error as ApiErrorResponse).message}`);
      throw (error as ApiErrorResponse)?.message;
    }
  }

  async findAllWebhooks({
    request,
    listQueryWebhooksData,
  }: {
    request: Request;
    listQueryWebhooksData?: ListQueryWebhooksDto;
  }): Promise<ApiResponseModel<Webhook[]>> {
    try {
      // From Cache
      let data = await this.cacheManagerService.cacheGetData(request);
      if (!isMissing(data)) {
        return {
          data,
          metadata: { query: listQueryWebhooksData },
        } as ApiResponseModel<Webhook[]>;
      }

      // Not From Cache
      const { skip, take, relations } = getPagination(listQueryWebhooksData);

      data = (await this.webhooksRepository.find({
        where: listQueryWebhooksData,
        relations: relations && ['user'],
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
        metadata: { query: listQueryWebhooksData },
      };
    } catch (error) {
      Logger.error(`Error in list webhook: ${(error as ApiErrorResponse).message}`);
      throw (error as ApiErrorResponse).message;
    }
  }

  async findOneWebhook({
    request,
    id,
    query,
  }: {
    request: Request;
    id: string;
    query?: ApiQueryParamUnifiedModel;
  }): Promise<ApiResponseModel<Webhook>> {
    // From Cache
    let data = await this.cacheManagerService.cacheGetData(request);
    if (!isMissing(data)) {
      return {
        data,
        metadata: { query },
      } as ApiResponseModel<Webhook>;
    }

    // Not From Cache
    const { relations } = getPagination(query);

    data = (await this.webhooksRepository.findOne({
      where: { id },
      relations: relations && ['user'],
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

  async updateWebhook({
    request,
    id,
    updateWebhookData,
  }: {
    request: Request;
    id: string;
    updateWebhookData: UpdateWebhookDto;
  }): Promise<ApiResponseModel<Webhook>> {
    //Actual user update
    const updated = await this.webhooksRepository.update(id, {
      ...updateWebhookData,
      user: (request?.['user'] as AuthUserPayload as AuthUserPayload)?.id,
    });
    if (!updated?.affected) {
      throw new BadRequestException(`Not updated`);
    }
    //Get updated user
    const data = await this.webhooksRepository.findOneBy({
      id,
    });
    return {
      data,
      metadata: {
        params: { id },
        body: updateWebhookData,
      },
      message: 'Webhook updated successfully',
    };
  }

  async removeWebhook(id: string): Promise<ApiResponseModel<Webhook>> {
    const deleted = await this.webhooksRepository.update(id, {
      isDeleted: true,
      isEnabled: false,
    });
    if (!deleted?.affected) {
      throw new BadRequestException(`Not deleted`);
    }
    //Get deleted user
    const data = await this.webhooksRepository.findOneBy({
      id,
    });
    return {
      data,
      metadata: { params: { id } },
      message: 'Webhook deleted successfully',
    };
  }

  // async handleWebhook(webhookRequest: WebhookRequestDto) {
  //   // Implement your webhook handling logic here
  //   console.log('Received webhook request:', webhookRequest);
  //   // Add your custom logic here
  //   return webhookRequest?.payload;
  // }

  async findWebhookByValue(query: Record<string, unknown>): Promise<boolean> {
    try {
      const data = await this.webhooksRepository.findOne({
        where: { ...query },
      });
      if (isMissing(data)) {
        return false;
      }
      return true;
    } catch (error) {
      Logger.error(`Error in webhook operation: ${(error as ApiErrorResponse).message}`);
      throw (error as ApiErrorResponse).message;
    }
  }

  async #createWebhookhistory({
    webhookTargetDetails,
    webhookResponse,
    payload,
  }: {
    webhookTargetDetails: Webhook;
    webhookResponse: Response;
    payload: Record<string, unknown>;
  }) {
    // INFO: Create Webhook History on Success or Failure
    const webhookHistoryResponse = await this.webhookHistoriesService.createWebhookHistory({
      webhook: webhookTargetDetails?.id,
      responseCode: webhookResponse?.status,
      status:
        webhookResponse?.status === 200 ? WebhookStatusEnum.Success : WebhookStatusEnum.Failed,
      nextTrigger: webhookResponse?.status !== 200 ? evaluateNextTriggerDateTime() : null,
      payload,
    });
    Logger.debug(
      `Webhook history generated for webhook history with id: ${webhookHistoryResponse?.id}`,
    );
  }

  prepareToSendWebhooks = async ({
    user,
    event,
    payload,
  }: {
    user: string;
    event: string;
    payload: Record<string, unknown>;
  }): Promise<void> => {
    try {
      // INFO: Fetch webhook data to send payload
      const webhookTargetDetails: Webhook = await this.webhooksRepository.findOne({
        where: {
          user,
          event: Equal(event as WebhookEventEnum),
        },
      });

      if (!isMissing(webhookTargetDetails)) {
        // INFO: Send webhook to the target url
        const webhookResponse: Response = await this.#sendWebhooks({
          webhookTargetDetails,
          payload,
        });

        // INFO: Update last trigger value in database
        await this.webhooksRepository.update(webhookTargetDetails?.id, {
          lastTriggered: new Date().toISOString(),
        });

        // INFO: Create Webhook History on Success or Failure
        await this.#createWebhookhistory({ webhookTargetDetails, webhookResponse, payload });
      }
    } catch (error) {
      Logger.error(`Error prepare webhook: `, (error as ApiErrorResponse).message);
    }
  };

  #sendWebhooks = async ({
    webhookTargetDetails,
    payload,
  }: {
    webhookTargetDetails: Webhook;
    payload: Record<string, unknown>;
  }): Promise<Response> => {
    try {
      // INFO: Prepare header
      let headers: Record<string, unknown>;
      if (!isMissing(webhookTargetDetails?.secret)) {
        headers = {
          'x-safe-webhook-id': webhookTargetDetails?.secret,
        };
      }
      // INFO: Sending webhook
      const response: Response = await fetch(webhookTargetDetails?.targetUrl, {
        method: 'POST',
        headers: {
          ...headers,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      // INFO: Error logging
      if (response?.status !== 200)
        Logger.error(
          `Failed to send webhook on ${webhookTargetDetails.targetUrl}:`,
          response?.statusText,
        );
      return response;
    } catch (error) {
      Logger.error(
        `Error sending webhook to ${webhookTargetDetails.targetUrl}:`,
        (error as ApiErrorResponse)?.message,
      );
    }
  };

  #isWebhookIsUnique = async ({
    event,
    user,
  }: {
    event?: string;
    user: string;
  }): Promise<boolean> => {
    const isWebhookUnique: boolean = await this.findWebhookByValue({
      event,
      user,
    });
    if (isWebhookUnique) {
      throw new ConflictException(`Event should be unique`);
    }
    return true;
  };
}
