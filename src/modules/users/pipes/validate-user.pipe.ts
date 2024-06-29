import { ConflictException, Injectable, PipeTransform } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../users.service';

@Injectable()
export class ValidateUserPipe implements PipeTransform {
  constructor(
    private readonly usersService: UsersService,
    // private readonly rolesService: RolesService,
    // private readonly usertypesService: UsertypesService,
  ) {}

  async transform(value: CreateUserDto) {
    //validate user If it is unique by email or not
    const isEmailUnique = await this.usersService.findUserByValue({ email: value?.email });

    if (isEmailUnique) {
      throw new ConflictException(`Email should be unique`);
    }
    const isPhoneUnique = await this.usersService.findUserByValue({
      phoneNumber: value?.phoneNumber,
    });
    if (isPhoneUnique) {
      throw new ConflictException(`Phone Number should be unique`);
    }

    return value;
  }
}
