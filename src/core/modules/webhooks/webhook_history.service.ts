import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiErrorResponse } from '../activity-logs/utils/types';
import { CreateWebhookHistoryDto } from './dtos/create-webhook-history.dto';
import { WebhookHistory } from './entities/webhook-history.entity';

@Injectable()
export class WebhookHistoriesService {
  constructor(
    @InjectRepository(WebhookHistory)
    private readonly webhookHistoriesRepository: Repository<WebhookHistory>,
  ) {}

  async createWebhookHistory(
    createWebhookHistoryData: CreateWebhookHistoryDto,
  ): Promise<WebhookHistory> {
    try {
      const newRecord = this.webhookHistoriesRepository.create(createWebhookHistoryData);
      const response = await this.webhookHistoriesRepository.save(newRecord);
      return response;
    } catch (error) {
      Logger.error(`Error in create webhook: ${(error as ApiErrorResponse).message}`);
      throw (error as ApiErrorResponse)?.message;
    }
  }
}
