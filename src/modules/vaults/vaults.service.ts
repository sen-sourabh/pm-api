import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getPagination } from '../../core/helpers/serializers';
import { isMissing } from '../../core/helpers/validations';
import { ApiErrorResponse } from '../../core/modules/activity-logs/utils/types';
import { AuthUserPayload } from '../../core/modules/auth/types';
import { CacheManagerService } from '../../core/modules/cache-manager/cache-manager.service';
import { WebhookEventEnum } from '../../core/modules/webhooks/enums';
import { WebhooksService } from '../../core/modules/webhooks/webhooks.service';
import { OrderEnum } from '../../core/shared/enums';
import { ApiResponseModel } from '../../core/shared/interfaces/api-response.interface';
import { ApiQueryParamUnifiedModel } from '../../core/shared/models/api-query.model';
import { CreateVaultDto } from './dtos/create-vault.dto';
import { ListQueryVaultsDto } from './dtos/list-vault.dto';
import { UpdateVaultDto } from './dtos/update-vault.dto';
import { Vault } from './entities/vault.entity';

@Injectable()
export class VaultsService {
  constructor(
    @InjectRepository(Vault)
    private readonly vaultsRepository: Repository<Vault>,
    private readonly webhooksService: WebhooksService,
    private readonly cacheManagerService: CacheManagerService,
  ) {}

  async createVault({
    request,
    CreateVaultData,
  }: {
    request: Request;
    CreateVaultData: CreateVaultDto;
  }): Promise<ApiResponseModel<Vault>> {
    try {
      //Verified Uniquness of vault within the user
      await this.#isVaultNameIsUnique({
        name: CreateVaultData?.name,
        user: (request?.['user'] as AuthUserPayload)?.id,
      });

      const newVault = this.vaultsRepository.create({
        ...CreateVaultData,
        user: (request?.['user'] as AuthUserPayload)?.id,
      });
      const data = await this.vaultsRepository.save(newVault);

      // INFO: Initiate webhook sender on `vault:created` event
      this.webhooksService.prepareToSendWebhooks({
        user: (request?.['user'] as AuthUserPayload)?.id,
        event: WebhookEventEnum.VaultCreated,
        payload: data as Record<string, unknown>,
      });

      return {
        data,
        metadata: { body: CreateVaultData },
        message: 'Vault created successfully',
      };
    } catch (error) {
      Logger.error(`Error in create vault: ${(error as ApiErrorResponse).message}`);
      throw (error as ApiErrorResponse).message;
    }
  }

  async findAllVaults({
    request,
    listQueryVaultsData,
  }: {
    request: Request;
    listQueryVaultsData?: ListQueryVaultsDto;
  }): Promise<ApiResponseModel<Vault[]>> {
    try {
      // From Cache
      let data = await this.cacheManagerService.cacheGetData(request);
      if (!isMissing(data)) {
        return {
          data,
          metadata: { query: listQueryVaultsData },
        } as ApiResponseModel<Vault[]>;
      }

      // Not From Cache
      const { skip, take, relations } = getPagination(listQueryVaultsData);

      data = (await this.vaultsRepository.find({
        where: listQueryVaultsData,
        relations: relations && ['user'],
        skip,
        take,
        order: { updatedAt: OrderEnum.DESC },
      })) as Record<string, unknown>[];

      // Set in Cache
      await this.cacheManagerService.cacheSetData({
        request,
        data,
      });

      return {
        data,
        metadata: { query: listQueryVaultsData },
      };
    } catch (error) {
      Logger.error(`Error in list vault: ${(error as ApiErrorResponse).message}`);
      throw (error as ApiErrorResponse).message;
    }
  }

  async findOneVault({
    request,
    id,
    query,
  }: {
    request: Request;
    id: string;
    query?: ApiQueryParamUnifiedModel;
  }): Promise<ApiResponseModel<Vault>> {
    // From Cache
    let data = await this.cacheManagerService.cacheGetData(request);
    if (!isMissing(data)) {
      return {
        data,
        metadata: { query },
      } as ApiResponseModel<Vault>;
    }

    // Not From Cache
    const { relations } = getPagination(query);

    data = (await this.vaultsRepository.findOne({
      where: { id },
      relations: relations && ['user'],
    })) as Record<string, unknown>;

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

  async updateVault({
    request,
    id,
    updateVaultData,
  }: {
    request: Request;
    id: string;
    updateVaultData: UpdateVaultDto;
  }): Promise<ApiResponseModel<Vault>> {
    //Verified Uniquness of vault within the user
    if (!isMissing(updateVaultData?.name)) {
      await this.#isVaultNameIsUnique({
        name: updateVaultData?.name,
        user: (request?.['user'] as AuthUserPayload)?.id,
      });
    }

    //Actual user update
    const updated = await this.vaultsRepository.update(id, {
      ...updateVaultData,
      user: (request?.['user'] as AuthUserPayload)?.id,
    });
    if (!updated?.affected) {
      throw new BadRequestException(`Not updated`);
    }
    //Get updated user
    const data = await this.vaultsRepository.findOneBy({
      id,
    });

    // INFO: Initiate webhook sender on `vault:updated` event
    this.webhooksService.prepareToSendWebhooks({
      user: (request?.['user'] as AuthUserPayload)?.id,
      event: WebhookEventEnum.VaultUpdated,
      payload: data as Record<string, unknown>,
    });

    return {
      data,
      metadata: {
        params: { id },
        body: updateVaultData,
      },
      message: 'Vault updated successfully',
    };
  }

  async removeVault({
    request,
    id,
  }: {
    request: Request;
    id: string;
  }): Promise<ApiResponseModel<Vault>> {
    const deleted = await this.vaultsRepository.update(id, {
      isDeleted: true,
      isEnabled: false,
    });
    if (!deleted?.affected) {
      throw new BadRequestException(`Not deleted`);
    }
    //Get deleted user
    const data = await this.vaultsRepository.findOneBy({
      id,
    });

    // INFO: Initiate webhook sender on `vault:deleted` event
    this.webhooksService.prepareToSendWebhooks({
      user: (request?.['user'] as AuthUserPayload)?.id,
      event: WebhookEventEnum.VaultDeleted,
      payload: data as Record<string, unknown>,
    });

    return {
      data,
      metadata: { params: { id } },
      message: 'Vault deleted successfully',
    };
  }

  async findVaultByValue(query: Record<string, unknown>): Promise<boolean> {
    try {
      const data = await this.vaultsRepository.findOne({
        where: { ...query },
      });
      if (isMissing(data)) {
        return false;
      }
      return true;
    } catch (error) {
      Logger.error(`Error in vault operation: ${(error as ApiErrorResponse).message}`);
      throw (error as ApiErrorResponse).message;
    }
  }

  #isVaultNameIsUnique = async ({ name, user }: { name?: string; user: string }) => {
    const isNameUnique = await this.findVaultByValue({
      name,
      user,
    });
    if (isNameUnique) {
      throw new ConflictException(`Name should be unique`);
    }
    return true;
  };
}
