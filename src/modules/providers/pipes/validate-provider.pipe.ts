import {
  ArgumentMetadata,
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { isMissing } from '../../../core/helpers/validations';
import { CreateProviderDto } from '../dtos/create-provider.dto';
import { UpdateProviderDto } from '../dtos/update-provider.dto';
import { ProvidersService } from '../providers.service';

@Injectable()
export class ValidateProviderPipe implements PipeTransform {
  constructor(private readonly providersService: ProvidersService) {}

  async transform(
    value: Partial<CreateProviderDto | UpdateProviderDto | Record<string, unknown>>,
    metadata: ArgumentMetadata,
  ) {
    if (metadata.metatype !== CreateProviderDto || metadata?.type === 'param') {
      if (Object.keys(value).length === 0) {
        throw new BadRequestException('At least a field is required to update');
      }
      await this.#whenUpdateOrDelete(value as UpdateProviderDto);
    } else {
      await this.#whenCreate(value as CreateProviderDto);
    }

    return value;
  }

  #whenUpdateOrDelete = async (value: UpdateProviderDto) => {
    //Record found during update
    if (!isMissing(value) && typeof value === 'string') {
      const isRecrodFound = await this.providersService.findProviderByValue({ id: value });
      if (!isRecrodFound) throw new NotFoundException(`Record not found with id: ${value}`);
    } else {
      if (isMissing(value?.vault)) throw new BadRequestException('Vault id is required');
      if (!isMissing(value?.name)) await this.#checkProviderNameIsUnique(value);
    }

    return true;
  };

  #whenCreate = async (value: CreateProviderDto) => {
    //Validate provider If it is unique by name or not
    await this.#checkProviderNameIsUnique(value);

    return true;
  };

  #checkProviderNameIsUnique = async (value?: { name?: string; vault?: string }) => {
    const isNameUnique = await this.providersService.findProviderByValue({
      name: value?.name,
      vault: value?.vault,
    });
    if (isNameUnique) {
      throw new ConflictException(`Name should be unique`);
    }
    return true;
  };
}
