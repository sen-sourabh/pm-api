import {
  ArgumentMetadata,
  ConflictException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { isMissing } from '../../../core/helpers/validations';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersService } from '../users.service';

@Injectable()
export class ValidateUserPipe implements PipeTransform {
  constructor(
    private readonly usersService: UsersService,
    // private readonly rolesService: RolesService,
    // private readonly usertypesService: UsertypesService,
  ) {}

  async transform(
    value: Partial<CreateUserDto | UpdateUserDto | Record<string, unknown>>,
    metadata: ArgumentMetadata,
  ) {
    if (metadata.metatype !== CreateUserDto || metadata?.type === 'param') {
      await this.whenUpdate(value as UpdateUserDto);
    } else {
      await this.whenCreate(value as CreateUserDto);
    }

    return value;
  }

  whenUpdate = async (value: UpdateUserDto) => {
    //Record found during update
    if (!isMissing(value) && typeof value === 'string') {
      const isRecrodFound = this.usersService.findUserByValue({ id: value });
      if (!isRecrodFound) throw new NotFoundException(`Record not found with id: ${value}`);
    }

    return true;
  };

  whenCreate = async (value: CreateUserDto) => {
    //Validate user If it is unique by email or not
    const isEmailUnique = await this.usersService.findUserByValue({ email: value?.email });
    if (isEmailUnique) {
      throw new ConflictException(`Email should be unique`);
    }

    //Validate user If it is unique by phone or not
    const isPhoneUnique = await this.usersService.findUserByValue({
      phoneNumber: value?.phoneNumber,
    });
    if (isPhoneUnique) {
      throw new ConflictException(`Phone Number should be unique`);
    }
    return true;
  };
}
