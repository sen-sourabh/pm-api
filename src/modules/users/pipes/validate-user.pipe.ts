import { ArgumentMetadata, ConflictException, Injectable, PipeTransform } from '@nestjs/common';
import { RolesService } from '../../roles/roles.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../users.service';

@Injectable()
export class ValidateUserPipe implements PipeTransform {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    // private readonly usertypesService: UsertypesService,
  ) {}

  async transform(value: CreateUserDto, metadata: ArgumentMetadata) {
    //validate user If it is unique by email or not
    const isEmailUnique = await this.usersService.findUserByValue({ email: value?.email });
    console.log('isEmailUnique: ', isEmailUnique);

    if (isEmailUnique) {
      throw new ConflictException(`Email should be unique`);
    }
    const isPhoneUnique = await this.usersService.findUserByValue({
      phoneNumber: value?.phoneNumber,
    });
    console.log('isPhoneUnique: ', isPhoneUnique);
    if (isPhoneUnique) {
      throw new ConflictException(`Phone Number should be unique`);
    }
    // const isRoleValid = await this.rolesService.findRoleByValue({ id: value?.role });
    // console.log('isRoleValid: ', isRoleValid);
    // if (isRoleValid) {
    //   throw new ConflictException(`Role should be valid`);
    // }
    // const isUsertypeValid = await this.usertypesService.findUsertypeByValue({
    //   id: value?.usertype,
    // });
    // console.log('isUsertypeValid: ', isUsertypeValid);
    // if (isUsertypeValid) {
    //   throw new ConflictException(`Usertype should be valid`);
    // }

    return value;
  }
}
