import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { isMissing } from '../../../core/helpers/validations';
import { UpdateVaultDto } from '../dtos/update-vault.dto';
import { VaultsService } from '../vaults.service';

@Injectable()
export class ValidateVaultPipe implements PipeTransform {
  constructor(private readonly vaultsService: VaultsService) {}

  async transform(
    value: Partial<UpdateVaultDto | Record<string, unknown>>,
    metadata: ArgumentMetadata,
  ) {
    if (metadata.metatype === UpdateVaultDto && Object.keys(value).length === 0) {
      throw new BadRequestException('At least a field is required to update');
    }
    if (metadata?.type === 'param' && !isMissing(value)) {
      const isRecrodFound = await this.vaultsService.findVaultByValue({ id: value });
      if (!isRecrodFound) throw new NotFoundException(`Record not found with id: ${value}`);
    }

    return value;
  }
}
