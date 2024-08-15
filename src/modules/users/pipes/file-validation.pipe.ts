import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { isMissing } from '../../../core/helpers/validations';
import { CreateFilesDto } from '../../../core/modules/files/dtos/create-file.dto';
import { UsersService } from '../users.service';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private readonly usersService: UsersService) {}

  async transform(value: CreateFilesDto, metadata: ArgumentMetadata) {
    if (metadata.metatype === CreateFilesDto) {
      if (isMissing(value?.entityId) || value?.entityId?.trim() === '')
        throw new BadRequestException(`valid entityId is required`);
      else await this.#userExist(value?.entityId);
    }

    return value;
  }

  async #userExist(id: string) {
    const result = await this.usersService.findUserByValue({ id });
    if (!result) throw new NotFoundException(`entity record not found with id: ${id}`);
    return result;
  }
}
