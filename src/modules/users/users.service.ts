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
import { CreateFilesDto } from '../../core/modules/files/dtos/create-file.dto';
import { FilesService } from '../../core/modules/files/files.service';
import { EntityFileResponseModel } from '../../core/modules/files/models/file.model';
import { OrderEnum } from '../../core/shared/enums';
import { ApiResponseModel } from '../../core/shared/interfaces/api-response.interface';
import { ApiQueryParamUnifiedModel } from '../../core/shared/models/api-query.model';
import { CreateUserDto } from './dto/create-user.dto';
import { ListQueryUsersDto } from './dto/list-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly filesService: FilesService,
  ) {}

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

  async createUsersFile(
    file: Express.Multer.File,
    createFileDto: CreateFilesDto,
  ): Promise<ApiResponseModel<EntityFileResponseModel>> {
    const response = (await this.filesService.uplaodFileToS3(file, 'users/profiles'))?.data?.url;

    return {
      data: {
        id: '123',
        url: response,
      },
      metadata: {
        body: { createFileDto, file: file?.originalname },
      },
    };
  }

  async findAllUsers(query?: ListQueryUsersDto): Promise<ApiResponseModel<User[]>> {
    try {
      const { skip, take, relations } = getPagination(query);

      const data = await this.usersRepository.find({
        where: query,
        relations: relations && ['role', 'accounttype'],
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

  async findOneUser(
    id: string,
    query?: ApiQueryParamUnifiedModel,
  ): Promise<ApiResponseModel<User>> {
    const { relations } = getPagination(query);

    const data = await this.usersRepository.findOne({
      where: { id },
      relations: relations && ['role', 'accounttype'],
    });
    if (isMissing(data)) {
      throw new NotFoundException(`Record not found with id: ${id}`);
    }
    return { data, metadata: { params: { id } } };
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<ApiResponseModel<User>> {
    //Actual user update
    const updated = await this.usersRepository.update(id, updateUserDto);
    if (!updated?.affected) {
      throw new BadRequestException(`Not updated`);
    }
    //Get updated user
    const data = await this.usersRepository.findOneBy({
      id,
    });
    return {
      data,
      metadata: {
        params: { id },
        body: updateUserDto,
      },
      message: 'User updated successfully',
    };
  }

  async removeUser(id: string): Promise<ApiResponseModel<User>> {
    const deleted = await this.usersRepository.update(id, {
      isDeleted: true,
      isEnabled: false,
    });
    if (!deleted?.affected) {
      throw new BadRequestException(`Not deleted`);
    }
    //Get deleted user
    const data = await this.usersRepository.findOneBy({
      id,
    });
    return {
      data,
      metadata: { params: { id } },
      message: 'User deleted successfully',
    };
  }

  async findUserByValue(query: Record<string, unknown>): Promise<boolean> {
    try {
      const data = await this.usersRepository.findOne({
        where: { ...query },
      });
      if (isMissing(data)) {
        return false;
      }
      return true;
    } catch (error) {
      Logger.error(`Error in user operation: ${error.message}`);
      return false;
    }
  }

  async findUser(query: Record<string, unknown>): Promise<User> {
    try {
      const data = await this.usersRepository.findOne({
        where: { ...query },
      });
      if (!data) {
        return null;
      }
      return data;
    } catch (error) {
      Logger.error(`Error in user operation: ${error.message}`);
      return null;
    }
  }
}
