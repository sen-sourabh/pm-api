import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { isMissingOrEmpty } from '../../../core/helpers/validations';
import { UsersService } from '../../users/users.service';
import { VaultsService } from '../../vaults/vaults.service';
import { CreateUsersAttachmentDto, CreateVaultsAttachmentDto } from '../dtos/create-attachment.dto';

@Injectable()
export class AttachmentBodyParserPipe implements PipeTransform {
  constructor(
    private readonly usersService: UsersService,
    private readonly vaultsService: VaultsService,
  ) {}

  async transform(
    value: Partial<CreateUsersAttachmentDto | CreateVaultsAttachmentDto>,
    metadata: ArgumentMetadata,
  ) {
    //Verify user
    if (metadata.metatype === CreateUsersAttachmentDto) {
      await this.#isUserValid(value);
    }
    //Verify vault
    if (metadata.metatype === CreateVaultsAttachmentDto) {
      await this.#isVaultValid(value);
    }
    //Verify payload
    if (!isMissingOrEmpty(value?.['user']) && !isMissingOrEmpty(value?.['vault'])) {
      throw new BadRequestException();
    }

    //All good
    return value;
  }

  #isUserValid = async (value: Partial<CreateUsersAttachmentDto>) => {
    if (isMissingOrEmpty(value?.['user'])) throw new BadRequestException(`User id is required`);
    const isUserExist = await this.usersService.findUserByValue({ id: value?.['user'] });
    if (!isUserExist) throw new NotFoundException(`Record not found with id: ${value?.['user']}`);
    return true;
  };

  #isVaultValid = async (value: Partial<CreateVaultsAttachmentDto>) => {
    if (isMissingOrEmpty(value?.['vault'])) throw new BadRequestException(`Vault id is required`);
    const isVaultExist = await this.vaultsService.findVaultByValue({ id: value?.['vault'] });
    if (!isVaultExist) throw new NotFoundException(`Record not found with id: ${value?.['vault']}`);
    return true;
  };
}
