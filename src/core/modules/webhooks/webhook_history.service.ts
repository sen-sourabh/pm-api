import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWebhookHistoryDto } from './dtos/create-webhook-history.dto';
import { WebhookHistory } from './entities/webhook-history.entity';

@Injectable()
export class WebhookHistoriesService {
  constructor(
    @InjectRepository(WebhookHistory)
    private readonly webhookHistoriesRepository: Repository<WebhookHistory>,
  ) {}

  async createWebhookHistory(createWebhookHistoryData: CreateWebhookHistoryDto) {
    try {
      const newRecord = this.webhookHistoriesRepository.create(createWebhookHistoryData);
      const response = await this.webhookHistoriesRepository.save(newRecord);
      return response;
    } catch (error) {
      Logger.error(`Error in create webhook: ${error.message}`);
      throw error;
    }
  }
}
