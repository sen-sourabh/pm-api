import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getPagination } from '../../helpers/serializers';
import { isMissing } from '../../helpers/validations';
import { OrderEnum } from '../../shared/enums';
import { ApiResponseModel } from '../../shared/interfaces/api-response.interface';
import { ApiQueryParamUnifiedModel } from '../../shared/models/api-query.model';
import { CreateWebhookDto } from './dtos/create-webhook.dto';
import { ListQueryWebhooksDto } from './dtos/list-webhook.dto';
import { UpdateWebhookDto } from './dtos/update-webhook.dto';
import { Webhook } from './entities/webhook.entity';

@Injectable()
export class WebhooksService {
  constructor(
    @InjectRepository(Webhook)
    private readonly webhooksRepository: Repository<Webhook>,
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
        user: request?.['user']?.id,
      });

      const newWebhook = this.webhooksRepository.create({
        ...CreateWebhookData,
        user: request?.['user']?.id,
      });
      const data = await this.webhooksRepository.save(newWebhook);
      return {
        data,
        metadata: { body: CreateWebhookData },
        message: 'Webhook created successfully',
      };
    } catch (error) {
      Logger.error(`Error in create webhook: ${error.message}`);
      throw error;
    }
  }

  async findAllWebhooks(query?: ListQueryWebhooksDto): Promise<ApiResponseModel<Webhook[]>> {
    try {
      const { skip, take, relations } = getPagination(query);

      const data = await this.webhooksRepository.find({
        where: query,
        relations: relations && ['user'],
        skip,
        take,
        order: { updatedAt: OrderEnum.DESC },
      });

      return {
        data,
        metadata: { query },
      };
    } catch (error) {
      Logger.error(`Error in list webhook: ${error.message}`);
      throw error;
    }
  }

  async findOneWebhook(
    id: string,
    query?: ApiQueryParamUnifiedModel,
  ): Promise<ApiResponseModel<Webhook>> {
    const { relations } = getPagination(query);

    const data = await this.webhooksRepository.findOne({
      where: { id },
      relations: relations && ['user'],
    });
    if (isMissing(data)) {
      throw new NotFoundException(`Record not found with id: ${id}`);
    }
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
      user: request?.['user']?.id,
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
      Logger.error(`Error in webhook operation: ${error.message}`);
      throw error;
    }
  }

  #isWebhookIsUnique = async ({ event, user }: { event?: string; user: string }) => {
    const isWebhookUnique = await this.findWebhookByValue({
      event,
      user,
    });
    if (isWebhookUnique) {
      throw new ConflictException(`Event should be unique`);
    }
    return true;
  };
}
