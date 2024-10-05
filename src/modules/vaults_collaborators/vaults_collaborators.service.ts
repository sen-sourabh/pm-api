import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
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
import { UsersService } from '../users/users.service';
import { CreateVaultsCollaboratorDto } from './dtos/create-vaults-collaborator.entity';
import { ListQueryVaultsCollaboratorDto } from './dtos/list-vaults-collaborator.entity';
import { UpdateVaultsCollaboratorDto } from './dtos/update-vaults-collaborator.entity';
import { VaultsCollaborator } from './entities/vaults_collaborator.entity';

@Injectable()
export class VaultsCollaboratorsService {
  constructor(
    @InjectRepository(VaultsCollaborator)
    private readonly vaultsCollaboratorsRepository: Repository<VaultsCollaborator>,
    private readonly usersService: UsersService,
    private readonly webhooksService: WebhooksService,
    private readonly cacheManagerService: CacheManagerService,
  ) {}

  async createVaultsCollaborator({
    request,
    createVaultsCollaboratorData,
  }: {
    request: Request;
    createVaultsCollaboratorData: CreateVaultsCollaboratorDto;
  }): Promise<ApiResponseModel<VaultsCollaborator>> {
    try {
      //Email exist or not
      const userId = await this.usersService.findOrCreateUserByEmail({
        request,
        createUserData: { email: createVaultsCollaboratorData?.user },
      });

      const newVault = this.vaultsCollaboratorsRepository.create({
        ...createVaultsCollaboratorData,
        user: userId,
        updatedBy: (request?.['user'] as AuthUserPayload)?.id,
      });

      const data = await this.vaultsCollaboratorsRepository.save(newVault);

      // INFO: Initiate webhook sender on `collaborator:created` event
      this.webhooksService.prepareToSendWebhooks({
        user: (request?.['user'] as AuthUserPayload)?.id,
        event: WebhookEventEnum.CollaboratorCreated,
        payload: data as unknown as Record<string, unknown>,
      });

      return {
        data,
        metadata: { body: createVaultsCollaboratorData },
        message: 'Vaults Collaborator created successfully',
      };
    } catch (error) {
      Logger.error(`Error in create vaults collaborator: ${(error as ApiErrorResponse).message}`);
      throw (error as ApiErrorResponse).message;
    }
  }

  async findAllVaultsCollaborators({
    request,
    listQueryVaultsCollaboratorData,
  }: {
    request: Request;
    listQueryVaultsCollaboratorData?: ListQueryVaultsCollaboratorDto;
  }): Promise<ApiResponseModel<VaultsCollaborator[]>> {
    try {
      // From Cache
      let data = await this.cacheManagerService.cacheGetData(request);
      if (!isMissing(data)) {
        return {
          data,
          metadata: { query: listQueryVaultsCollaboratorData },
        } as unknown as ApiResponseModel<VaultsCollaborator[]>;
      }

      // Not From Cache
      const { skip, take, relations } = getPagination(listQueryVaultsCollaboratorData);

      data = (await this.vaultsCollaboratorsRepository.find({
        where: listQueryVaultsCollaboratorData,
        relations: relations && ['user', 'vault', 'role', 'updatedBy'],
        skip,
        take,
        order: { updatedAt: OrderEnum.DESC },
      })) as unknown as Record<string, unknown>[];

      // Set in Cache
      await this.cacheManagerService.cacheSetData({
        request,
        data,
      });

      return {
        data,
        metadata: { query: listQueryVaultsCollaboratorData },
      } as unknown as ApiResponseModel<VaultsCollaborator[]>;
    } catch (error) {
      Logger.error(`Error in list vaults collaborator: ${(error as ApiErrorResponse).message}`);
      throw (error as ApiErrorResponse).message;
    }
  }

  async findOneVaultsCollaborator({
    request,
    id,
    query,
  }: {
    request: Request;
    id: string;
    query?: ApiQueryParamUnifiedModel;
  }): Promise<ApiResponseModel<VaultsCollaborator>> {
    // From Cache
    let data = await this.cacheManagerService.cacheGetData(request);
    if (!isMissing(data)) {
      return {
        data,
        metadata: { query },
      } as unknown as ApiResponseModel<VaultsCollaborator>;
    }

    // Not From Cache
    const { relations } = getPagination(query);

    data = (await this.vaultsCollaboratorsRepository.findOne({
      where: { id },
      relations: relations && ['user', 'vault', 'role', 'updatedBy'],
    })) as unknown as Record<string, unknown>;

    if (isMissing(data)) {
      throw new NotFoundException(`Record not found with id: ${id}`);
    }

    // Set in Cache
    await this.cacheManagerService.cacheSetData({
      request,
      data,
    });

    return { data, metadata: { query } } as unknown as ApiResponseModel<VaultsCollaborator>;
  }

  async updateVaultsCollaborator({
    request,
    id,
    updateVaultsCollaboratorData,
  }: {
    request: Request;
    id: string;
    updateVaultsCollaboratorData: UpdateVaultsCollaboratorDto;
  }): Promise<ApiResponseModel<VaultsCollaborator>> {
    //Email exist or not
    let userId: string;
    if (!isMissing(updateVaultsCollaboratorData?.user)) {
      userId = await this.usersService.findOrCreateUserByEmail({
        request,
        createUserData: { email: updateVaultsCollaboratorData?.user },
      });
    }

    updateVaultsCollaboratorData = {
      ...updateVaultsCollaboratorData,
      user: userId,
      updatedBy: (request?.['user'] as AuthUserPayload)?.id,
    };

    //Actual collaborator update
    const updated = await this.vaultsCollaboratorsRepository.update(
      id,
      updateVaultsCollaboratorData,
    );
    if (!updated?.affected) {
      throw new BadRequestException(`Not updated`);
    }
    //Get updated collaborator
    const data = await this.vaultsCollaboratorsRepository.findOneBy({
      id,
    });

    // INFO: Initiate webhook sender on `collaborator:updated` event
    this.webhooksService.prepareToSendWebhooks({
      user: (request?.['user'] as AuthUserPayload)?.id,
      event: WebhookEventEnum.CollaboratorUpdated,
      payload: data as unknown as Record<string, unknown>,
    });

    return {
      data,
      metadata: {
        params: { id },
        body: updateVaultsCollaboratorData,
      },
      message: 'Vaults Collaborator updated successfully',
    };
  }

  async removeVaultsCollaborator({
    request,
    id,
  }: {
    request: Request;
    id: string;
  }): Promise<ApiResponseModel<VaultsCollaborator>> {
    const deleted = await this.vaultsCollaboratorsRepository.delete(id);

    if (!deleted?.affected) throw new BadRequestException(`Not deleted`);

    // INFO: Initiate webhook sender on `collaborator:deleted` event
    this.webhooksService.prepareToSendWebhooks({
      user: (request?.['user'] as AuthUserPayload)?.id,
      event: WebhookEventEnum.CollaboratorDeleted,
      payload: { id },
    });

    return {
      message: 'Vaults Collaborator deleted successfully',
    };
  }

  async findCollaboratorByValue(query: Record<string, unknown>): Promise<boolean> {
    try {
      const data = await this.vaultsCollaboratorsRepository.findOne({
        where: { ...query },
      });
      if (isMissing(data)) {
        return false;
      }
      return true;
    } catch (error) {
      Logger.error(
        `Error in vaults collaborator operation: ${(error as ApiErrorResponse).message}`,
      );
      return false;
    }
  }
}
