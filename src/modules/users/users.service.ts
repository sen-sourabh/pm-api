import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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
    try {
      const newUser = this.usersRepository.create(createUserData);
      const data = await this.usersRepository.save(newUser);
      return {
        data,
        metadata: { body: createUserData },
        message: 'User created successfully',
      };
    } catch (error) {
      Logger.error(`Error in create user: ${error.message}`);
      throw new InternalServerErrorException(`Error in create user: ${error.message}`);
    }
  }

  async findAllUsers(query?: ListQueryUsersDto): Promise<ApiResponseModel<User[]>> {
    try {
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
    } catch (error) {
      Logger.error(`Error in list user: ${error.message}`);
      throw new InternalServerErrorException(`Error in list user: ${error.message}`);
    }
  }

  async findOneUser(id: string): Promise<ApiResponseModel<User>> {
    try {
      const data = await this.usersRepository.findOne({ where: { id } });
      if (isMissing(data)) {
        throw new NotFoundException(`Record not found with id: ${id}`);
      }
      return { data, metadata: { params: { id } } };
    } catch (error) {
      Logger.error(`Error in get user: ${error.message}`);
      throw new InternalServerErrorException(`Error in get user: ${error.message}`);
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<ApiResponseModel<User>> {
    try {
      //Actual user update
      const updated = await this.usersRepository.update(id, updateUserDto);
      if (!updated?.affected) {
        throw new BadRequestException(`Not updated`);
      }
      //Get updated user
      const { data } = await this.findOneUser(id);
      return {
        data,
        metadata: { params: { id }, body: updateUserDto },
        message: 'User updated successfully',
      };
    } catch (error) {
      Logger.error(`Error in update user: ${error.message}`);
      throw new InternalServerErrorException(`Error in update user: ${error.message}`);
    }
  }

  async removeUser(id: string): Promise<ApiResponseModel<User>> {
    try {
      const deleted = await this.usersRepository.update(id, { isDeleted: true });
      if (!deleted?.affected) {
        throw new BadRequestException(`Not deleted`);
      }
      //Get deleted user
      const { data } = await this.findOneUser(id);
      return {
        data,
        metadata: { params: { id } },
        message: 'User deleted successfully',
      };
    } catch (error) {
      Logger.error(`Error in delete user: ${error.message}`);
      throw new InternalServerErrorException(`Error in delete user: ${error.message}`);
    }
  }

  async findUserByValue(query: Record<string, unknown>): Promise<boolean> {
    try {
      const data = await this.usersRepository.findOne({ where: { ...query } });
      if (isMissing(data)) {
        return false;
      }
      return true;
    } catch (error) {
      Logger.error(`Error in user operation: ${error.message}`);
      throw new InternalServerErrorException(`Error in user operation: ${error.message}`);
    }
  }
}
