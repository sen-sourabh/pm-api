import {
  ArgumentMetadata,
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { isMissing } from '../../../core/helpers/validations';
import { CreateVaultDto } from '../dtos/create-vault.dto';
import { UpdateVaultDto } from '../dtos/update-vault.dto';
import { VaultsService } from '../vaults.service';

@Injectable()
export class ValidateVaultPipe implements PipeTransform {
  constructor(private readonly vaultsService: VaultsService) {}

  async transform(
    value: Partial<CreateVaultDto | UpdateVaultDto | Record<string, unknown>>,
    metadata: ArgumentMetadata,
  ) {
    if (metadata.metatype !== CreateVaultDto || metadata?.type === 'param') {
      if (Object.keys(value).length === 0) {
        throw new BadRequestException('At least a field is required to update');
      }
      await this.#whenUpdateOrDelete(value as UpdateVaultDto);
    } else {
      await this.#whenCreate(value as CreateVaultDto);
    }

    return value;
  }

  #whenUpdateOrDelete = async (value: UpdateVaultDto) => {
    //Record found during update
    if (!isMissing(value) && typeof value === 'string') {
      const isRecrodFound = await this.vaultsService.findVaultByValue({ id: value });
      if (!isRecrodFound) throw new NotFoundException(`Record not found with id: ${value}`);
    } else {
      if (isMissing(value?.user)) throw new BadRequestException('User id is required');
      if (!isMissing(value?.name)) await this.#checkVaultNameIsUnique(value);
    }

    return true;
  };

  #whenCreate = async (value: CreateVaultDto) => {
    //Validate vault If it is unique by name or not
    await this.#checkVaultNameIsUnique(value);

    return true;
  };

  #checkVaultNameIsUnique = async (value?: { name?: string; user?: string }) => {
    const isNameUnique = await this.vaultsService.findVaultByValue({
      name: value?.name,
      user: value?.user,
    });
    if (isNameUnique) {
      throw new ConflictException(`Name should be unique`);
    }
    return true;
  };
}
