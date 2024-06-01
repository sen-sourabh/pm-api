import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WebhookRequestDto } from './dtos/webhook-request.dto';
import { WebhooksService } from './webhooks.service';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhookService: WebhooksService) {}

  @HttpCode(200)
  @Post()
  async handleWebhook(@Body() webhookRequest: WebhookRequestDto) {
    try {
      await this.webhookService.handleWebhook(webhookRequest);
    } catch (err) {
      console.error('Webhook service error:', err.message);
      return 'Webhook service Error';
    }

    return 'Webhook received successfully';
  }
}
