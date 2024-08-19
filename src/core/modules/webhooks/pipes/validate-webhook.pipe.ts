import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { isMissing } from '../../../helpers/validations';
import { UpdateWebhookDto } from '../dtos/update-webhook.dto';
import { WebhooksService } from '../webhooks.service';

@Injectable()
export class ValidateWebhookPipe implements PipeTransform {
  constructor(private readonly vaultsService: WebhooksService) {}

  async transform(
    value: Partial<UpdateWebhookDto | Record<string, unknown>>,
    metadata: ArgumentMetadata,
  ) {
    if (metadata.metatype === UpdateWebhookDto && Object.keys(value).length === 0) {
      throw new BadRequestException('At least a field is required to update');
    }
    if (metadata?.type === 'param' && !isMissing(value)) {
      const isRecrodFound = await this.vaultsService.findWebhookByValue({ id: value });
      if (!isRecrodFound) throw new NotFoundException(`Record not found with id: ${value}`);
    }

    return value;
  }
}
