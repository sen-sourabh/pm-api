import { Injectable } from '@nestjs/common';
import { WebhookRequestDto } from './dtos/webhook-request.dto';

@Injectable()
export class WebhooksService {
  async handleWebhook(webhookRequest: WebhookRequestDto) {
    // Implement your webhook handling logic here
    console.log('Received webhook request:', webhookRequest);
    // Add your custom logic here
    return webhookRequest?.payload;
  }
}
