import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getPagination } from '../../core/helpers/serializers';
import { isMissing } from '../../core/helpers/validations';
import { OrderEnum } from '../../core/shared/enums';
import { ApiResponseModel } from '../../core/shared/interfaces/api-response.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { ListQueryUsersDto } from './dto/list-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  async createUser(createUserData: CreateUserDto): Promise<ApiResponseModel<User>> {
    const newUser = this.usersRepository.create(createUserData);
    const data = await this.usersRepository.save(newUser);
    return {
      data,
      metadata: { body: createUserData },
      message: 'User created successfully',
    };
  }

  async findAllUsers(query?: ListQueryUsersDto): Promise<ApiResponseModel<User[]>> {
    const { skip, take } = getPagination(query);

    const data = await this.usersRepository.find({
      where: query,
      skip,
      take,
      order: { updatedAt: OrderEnum.DESC },
    });

    return {
      data,
      metadata: { query },
    };
  }

  async findOneUser(id: string): Promise<ApiResponseModel<User>> {
    const data = await this.usersRepository.findOne({ where: { id } });
    if (isMissing(data)) {
      throw new NotFoundException(`Record not found with id: ${id}`);
    }
    return { data, metadata: { params: { id } } };
  }

  updateUser(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  removeUser(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUserByValue(query: Record<string, unknown>): Promise<boolean> {
    const data = await this.usersRepository.findOne({ where: { ...query, isDeleted: false } });
    if (isMissing(data)) {
      return false;
    }
    return true;
  }
}
