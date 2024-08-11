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
  ) {}

  async createVaultsCollaborator(
    createVaultData: CreateVaultsCollaboratorDto,
  ): Promise<ApiResponseModel<VaultsCollaborator>> {
    try {
      //Email exist or not
      const userId = await this.usersService.findOrCreateUserByEmail({
        email: createVaultData?.user,
      });

      const newVault = this.vaultsCollaboratorsRepository.create({
        ...createVaultData,
        user: userId,
      });
      const data = await this.vaultsCollaboratorsRepository.save(newVault);
      return {
        data,
        metadata: { body: createVaultData },
        message: 'Vaults Collaborator created successfully',
      };
    } catch (error) {
      Logger.error(`Error in create vaults collaborator: ${error.message}`);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error in create vaults collaborator: ${error.message}`,
      );
    }
  }

  async findAllVaultsCollaborators(
    query?: ListQueryVaultsCollaboratorDto,
  ): Promise<ApiResponseModel<VaultsCollaborator[]>> {
    try {
      const { skip, take, relations } = getPagination(query);

      const data = await this.vaultsCollaboratorsRepository.find({
        where: query,
        relations: relations && ['user', 'vault', 'role'],
        skip,
        take,
        order: { updatedAt: OrderEnum.DESC },
      });

      return {
        data,
        metadata: { query },
      };
    } catch (error) {
      Logger.error(`Error in list vaults collaborator: ${error.message}`);
      throw new InternalServerErrorException(`Error in list vaults collaborator: ${error.message}`);
    }
  }

  async findOneVaultsCollaborator(
    id: string,
    query?: ApiQueryParamUnifiedModel,
  ): Promise<ApiResponseModel<VaultsCollaborator>> {
    const { relations } = getPagination(query);

    const data = await this.vaultsCollaboratorsRepository.findOne({
      where: { id },
      relations: relations && ['user', 'vault', 'role'],
    });
    if (isMissing(data)) {
      throw new NotFoundException(`Record not found with id: ${id}`);
    }
    return { data, metadata: { params: { id } } };
  }

  async updateVaultsCollaborator(
    id: string,
    updateVaultDto: UpdateVaultsCollaboratorDto,
  ): Promise<ApiResponseModel<VaultsCollaborator>> {
    //Email exist or not
    if (!isMissing(updateVaultDto?.user)) {
      const userId = await this.usersService.findOrCreateUserByEmail({
        email: updateVaultDto?.user,
      });
      updateVaultDto = {
        ...updateVaultDto,
        user: userId,
      };
    }

    //Actual user update
    const updated = await this.vaultsCollaboratorsRepository.update(id, updateVaultDto);
    if (!updated?.affected) {
      throw new BadRequestException(`Not updated`);
    }
    //Get updated user
    const data = await this.vaultsCollaboratorsRepository.findOneBy({
      id,
    });
    return {
      data,
      metadata: {
        params: { id },
        body: updateVaultDto,
      },
      message: 'Vaults Collaborator updated successfully',
    };
  }

  async removeVaultsCollaborator(id: string): Promise<ApiResponseModel<VaultsCollaborator>> {
    const deleted = await this.vaultsCollaboratorsRepository.delete(id);

    if (!deleted?.affected) throw new BadRequestException(`Not deleted`);
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
      Logger.error(`Error in vaults collaborator operation: ${error.message}`);
      return false;
    }
  }
}
