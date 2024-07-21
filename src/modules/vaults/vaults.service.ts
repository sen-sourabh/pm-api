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
import { CreateVaultDto } from './dtos/create-vault.dto';
import { ListQueryVaultsDto } from './dtos/list-vault.dto';
import { UpdateVaultDto } from './dtos/update-vault.dto';
import { Vault } from './entities/vault.entity';

@Injectable()
export class VaultsService {
  constructor(@InjectRepository(Vault) private readonly vaultsRepository: Repository<Vault>) {}

  async createVault(createVaultData: CreateVaultDto): Promise<ApiResponseModel<Vault>> {
    try {
      const newVault = this.vaultsRepository.create(createVaultData);
      const data = await this.vaultsRepository.save(newVault);
      return {
        data,
        metadata: { body: createVaultData },
        message: 'Vault created successfully',
      };
    } catch (error) {
      Logger.error(`Error in create vault: ${error.message}`);
      throw new InternalServerErrorException(`Error in create vault: ${error.message}`);
    }
  }

  async findAllVaults(query?: ListQueryVaultsDto): Promise<ApiResponseModel<Vault[]>> {
    try {
      const { skip, take, relations } = getPagination(query);

      const data = await this.vaultsRepository.find({
        where: query,
        relations: relations && ['user'],
        skip,
        take,
        order: { updatedAt: OrderEnum.DESC },
      });

      return {
        data,
        metadata: { query },
      };
    } catch (error) {
      Logger.error(`Error in list vault: ${error.message}`);
      throw new InternalServerErrorException(`Error in list vault: ${error.message}`);
    }
  }

  async findOneVault(
    id: string,
    query?: ApiQueryParamUnifiedModel,
  ): Promise<ApiResponseModel<Vault>> {
    const { relations } = getPagination(query);

    const data = await this.vaultsRepository.findOne({
      where: { id },
      relations: relations && ['user'],
    });
    if (isMissing(data)) {
      throw new NotFoundException(`Record not found with id: ${id}`);
    }
    return { data, metadata: { params: { id } } };
  }

  async updateVault(id: string, updateVaultDto: UpdateVaultDto): Promise<ApiResponseModel<Vault>> {
    //Actual user update
    const updated = await this.vaultsRepository.update(id, updateVaultDto);
    if (!updated?.affected) {
      throw new BadRequestException(`Not updated`);
    }
    //Get updated user
    const data = await this.vaultsRepository.findOneBy({ id });
    return {
      data,
      metadata: { params: { id }, body: updateVaultDto },
      message: 'Vault updated successfully',
    };
  }

  async removeVault(id: string): Promise<ApiResponseModel<Vault>> {
    const deleted = await this.vaultsRepository.update(id, { isDeleted: true, isEnabled: false });
    if (!deleted?.affected) {
      throw new BadRequestException(`Not deleted`);
    }
    //Get deleted user
    const data = await this.vaultsRepository.findOneBy({ id });
    return {
      data,
      metadata: { params: { id } },
      message: 'Vault deleted successfully',
    };
  }

  async findVaultByValue(query: Record<string, unknown>): Promise<boolean> {
    try {
      const data = await this.vaultsRepository.findOne({ where: { ...query } });
      if (isMissing(data)) {
        return false;
      }
      return true;
    } catch (error) {
      Logger.error(`Error in vault operation: ${error.message}`);
      return false;
    }
  }
}
