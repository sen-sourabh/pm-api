import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { generateSecretKey } from '../../core/helpers/security';
import { getPagination } from '../../core/helpers/serializers';
import { isMissing, validateEmail } from '../../core/helpers/validations';
import { AuthUserPayload } from '../../core/modules/auth/types';
import { CacheManagerService } from '../../core/modules/cache-manager/cache-manager.service';
import { EmailPurposeEnum } from '../../core/modules/messenger/enums';
import { MessengerService } from '../../core/modules/messenger/messenger.service';
import { WebhookEventEnum } from '../../core/modules/webhooks/enums';
import { WebhooksService } from '../../core/modules/webhooks/webhooks.service';
import { OrderEnum } from '../../core/shared/enums';
import { ApiResponseModel } from '../../core/shared/interfaces/api-response.interface';
import { ApiQueryParamUnifiedModel } from '../../core/shared/models/api-query.model';
import { CreateUserDto } from './dto/create-user.dto';
import { ListQueryUsersDto } from './dto/list-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { getUsersFullName } from './utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly messengerService: MessengerService,
    private readonly webhooksService: WebhooksService,
    private readonly cacheManagerService: CacheManagerService,
  ) {}

  async createUser({
    request,
    createUserData,
  }: {
    request?: Request;
    createUserData: CreateUserDto;
  }): Promise<ApiResponseModel<User>> {
    try {
      const newUser = this.usersRepository.create({
        ...createUserData,
        secretKey: generateSecretKey(),
      });
      const data = await this.usersRepository.save(newUser);

      // INFO: Email of verification has been sent
      const isSent = await this.messengerService.sendAccountVerificationEmail({
        username: getUsersFullName(data),
        email: [data?.email],
        subject: 'Please complete your SignUp with us',
        purpose: EmailPurposeEnum.AccountVerification,
      });

      // INFO: Initiate webhook sender on `user:created` event
      this.webhooksService.prepareToSendWebhooks({
        user: request?.['user']?.id,
        event: WebhookEventEnum.UserCreated,
        payload: data,
      });

      return {
        data,
        metadata: { body: createUserData },
        message: isSent
          ? 'User created successfully, Please check your email to verify'
          : 'User created successfully',
      };
    } catch (error) {
      Logger.error(`Error in create user: ${error.message}`);
      throw new InternalServerErrorException(`Error in create user: ${error.message}`);
    }
  }

  async findAllUsers({
    request,
    listQueryUsersData,
  }: {
    request: Request;
    listQueryUsersData?: ListQueryUsersDto;
  }): Promise<ApiResponseModel<User[]>> {
    try {
      // From Cache
      let data = await this.cacheManagerService.cacheGetData(request);
      if (!isMissing(data)) {
        return {
          data,
          metadata: { query: listQueryUsersData },
        };
      }

      // Not From Cache
      const { skip, take, relations } = getPagination(listQueryUsersData);

      data = await this.usersRepository.find({
        where: listQueryUsersData,
        relations: relations && ['role', 'accountType'],
        skip,
        take,
        order: { updatedAt: OrderEnum.DESC },
      });

      // Set in Cache
      await this.cacheManagerService.cacheSetData({
        request,
        data,
      });

      return {
        data,
        metadata: { query: listQueryUsersData },
      };
    } catch (error) {
      Logger.error(`Error in list user: ${error.message}`);
      throw new InternalServerErrorException(`Error in list user: ${error.message}`);
    }
  }

  async findOneUser({
    request,
    id,
    query,
  }: {
    request: Request;
    id: string;
    query?: ApiQueryParamUnifiedModel;
  }): Promise<ApiResponseModel<User>> {
    // From Cache
    let data = await this.cacheManagerService.cacheGetData(request);
    if (!isMissing(data)) {
      return {
        data,
        metadata: { query },
      };
    }

    // Not From Cache
    const { relations } = getPagination(query);

    data = await this.usersRepository.findOne({
      where: { id },
      relations: relations && ['role', 'accountType'],
    });
    if (isMissing(data)) {
      throw new NotFoundException(`Record not found with id: ${id}`);
    }

    // Set in Cache
    await this.cacheManagerService.cacheSetData({
      request,
      data,
    });

    return { data, metadata: { query } };
  }

  async updateUser({
    request,
    id,
    updateUserData,
  }: {
    request: Request | AuthUserPayload;
    id: string;
    updateUserData: UpdateUserDto;
  }): Promise<ApiResponseModel<User>> {
    //Actual user update
    const updated = await this.usersRepository.update(id, updateUserData);
    if (!updated?.affected) {
      throw new BadRequestException(`Not updated`);
    }
    //Get updated user
    const data = await this.usersRepository.findOneBy({
      id,
    });

    // INFO: Initiate webhook sender on `user:updated` event
    this.webhooksService.prepareToSendWebhooks({
      user: request?.['user']?.id,
      event: WebhookEventEnum.UserUpdated,
      payload: data,
    });

    return {
      data,
      metadata: {
        params: { id },
        body: updateUserData,
      },
      message: 'User updated successfully',
    };
  }

  async removeUser({
    request,
    id,
  }: {
    request: Request;
    id: string;
  }): Promise<ApiResponseModel<User>> {
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

    // INFO: Initiate webhook sender on `user:deleted` event
    this.webhooksService.prepareToSendWebhooks({
      user: request?.['user']?.id,
      event: WebhookEventEnum.UserDeleted,
      payload: data,
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

  async findOrCreateUserByEmail({
    request,
    createUserData,
  }: {
    request: Request;
    createUserData: Partial<CreateUserDto>;
  }): Promise<string> {
    //Validate Email
    if (!validateEmail(createUserData?.email)) throw new BadRequestException(`Email is invalid`);

    //Find/Create one user
    let user = await this.usersRepository.findOneBy(createUserData);
    if (!user) {
      user = await this.usersRepository.save({ ...createUserData, secretKey: generateSecretKey() });
      // INFO: Initiate to Webhook Sender
      this.webhooksService.prepareToSendWebhooks({
        user: request?.['user']?.id,
        event: WebhookEventEnum.UserCreated,
        payload: user,
      });
    }
    return user?.id;
  }
}
