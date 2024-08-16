import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getPagination } from '../../core/helpers/serializers';
import { isMissing } from '../../core/helpers/validations';
import { OrderEnum } from '../../core/shared/enums';
import { ApiResponseModel } from '../../core/shared/interfaces/api-response.interface';
import { ApiQueryParamUnifiedModel } from '../../core/shared/models/api-query.model';
import { CreateProviderFieldAssociationDto } from './dtos/create-provider_field_association.dto';
import { ListQueryProviderFieldAssociationsDto } from './dtos/list-provider_field_association.dto';
import { UpdateProviderFieldAssociationDto } from './dtos/update-provider_field_association.dto';
import { ProviderFieldAssociation } from './entities/provider_field_association.entity';

@Injectable()
export class ProviderFieldAssociationsService {
  constructor(
    @InjectRepository(ProviderFieldAssociation)
    private readonly providerFieldAssociationsRepository: Repository<ProviderFieldAssociation>,
  ) {}

  async createProviderFieldAssociation({
    request,
    createProviderFieldAssociationData,
  }: {
    request: Request;
    createProviderFieldAssociationData: CreateProviderFieldAssociationDto;
  }): Promise<ApiResponseModel<ProviderFieldAssociation>> {
    try {
      const newProviderFieldAssociation = this.providerFieldAssociationsRepository.create({
        ...createProviderFieldAssociationData,
        addedBy: request?.['user']?.id,
      });
      const data = await this.providerFieldAssociationsRepository.save(newProviderFieldAssociation);
      return {
        data,
        metadata: { body: createProviderFieldAssociationData },
        message: 'ProviderFieldAssociation created successfully',
      };
    } catch (error) {
      Logger.error(`Error in create provider field association: ${error.message}`);
      throw error;
    }
  }

  async findAllProviderFieldAssociations(
    query?: ListQueryProviderFieldAssociationsDto,
  ): Promise<ApiResponseModel<ProviderFieldAssociation[]>> {
    try {
      const { skip, take, relations } = getPagination(query);

      const data = await this.providerFieldAssociationsRepository.find({
        where: query,
        relations: relations && ['provider', 'customField', 'addedBy'],
        skip,
        take,
        order: { updatedAt: OrderEnum.DESC },
      });

      return {
        data,
        metadata: { query },
      };
    } catch (error) {
      Logger.error(`Error in list provider field association: ${error.message}`);
      throw error;
    }
  }

  async findOneProviderFieldAssociation(
    id: string,
    query?: ApiQueryParamUnifiedModel,
  ): Promise<ApiResponseModel<ProviderFieldAssociation>> {
    const { relations } = getPagination(query);

    const data = await this.providerFieldAssociationsRepository.findOne({
      where: { id },
      relations: relations && ['provider', 'customField', 'addedBy'],
    });
    if (isMissing(data)) {
      throw new NotFoundException(`Record not found with id: ${id}`);
    }
    return { data, metadata: { params: { id } } };
  }

  async updateProviderFieldAssociation(
    id: string,
    updateProviderFieldAssociationDto: UpdateProviderFieldAssociationDto,
  ): Promise<ApiResponseModel<ProviderFieldAssociation>> {
    //Actual user update
    const updated = await this.providerFieldAssociationsRepository.update(
      id,
      updateProviderFieldAssociationDto,
    );
    if (!updated?.affected) {
      throw new BadRequestException(`Not updated`);
    }
    //Get updated user
    const data = await this.providerFieldAssociationsRepository.findOneBy({
      id,
    });
    return {
      data,
      metadata: {
        params: { id },
        body: updateProviderFieldAssociationDto,
      },
      message: 'ProviderFieldAssociation updated successfully',
    };
  }

  async removeProviderFieldAssociation(
    id: string,
  ): Promise<ApiResponseModel<ProviderFieldAssociation>> {
    const deleted = await this.providerFieldAssociationsRepository.delete(id);
    if (!deleted?.affected) throw new BadRequestException(`Not deleted`);
    return {
      message: 'ProviderFieldAssociation deleted successfully',
    };
  }

  async findProviderFieldAssociationByValue(query: Record<string, unknown>): Promise<boolean> {
    try {
      const data = await this.providerFieldAssociationsRepository.findOne({
        where: { ...query },
      });
      if (isMissing(data)) {
        return false;
      }
      return true;
    } catch (error) {
      Logger.error(`Error in provider field association operation: ${error.message}`);
      return false;
    }
  }
}
