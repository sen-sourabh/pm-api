import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getPagination } from '../../core/helpers/serializers';
import { OrderEnum } from '../../core/shared/enums';
import { ApiResponseModel } from '../../core/shared/interfaces/api-response.interface';
import { CreateVaultDto } from './dtos/create-vault.dto';
import { ListQueryVaultsDto } from './dtos/list-vault.dto';
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
}
