import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getPagination } from '../../core/helpers/serializers';
import { isMissing } from '../../core/helpers/validations';
import { OrderEnum } from '../../core/shared/enums';
import { ApiResponseModel } from '../../core/shared/interfaces/api-response.interface';
import { ApiQueryParamUnifiedModel } from '../../core/shared/models/api-query.model';
import { CreateProviderDto } from './dtos/create-provider.dto';
import { ListQueryProvidersDto } from './dtos/list-provider.dto';
import { UpdateProviderDto } from './dtos/update-provider.dto';
import { Provider } from './entities/provider.entity';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Provider)
    private readonly providersRepository: Repository<Provider>,
  ) {}

  async createProvider({
    request,
    createProviderData,
  }: {
    request: Request;
    createProviderData: CreateProviderDto;
  }): Promise<ApiResponseModel<Provider>> {
    try {
      const newProvider = this.providersRepository.create({
        ...createProviderData,
        addedBy: request?.['user']?.id,
      });
      const data = await this.providersRepository.save(newProvider);
      return {
        data,
        metadata: { body: createProviderData },
        message: 'Provider created successfully',
      };
    } catch (error) {
      Logger.error(`Error in create provider: ${error.message}`);
      throw error;
    }
  }

  async findAllProviders(query?: ListQueryProvidersDto): Promise<ApiResponseModel<Provider[]>> {
    try {
      const { skip, take, relations } = getPagination(query);

      const data = await this.providersRepository.find({
        where: query,
        relations: relations && ['vault', 'addedBy'],
        skip,
        take,
        order: { updatedAt: OrderEnum.DESC },
      });

      return {
        data,
        metadata: { query },
      };
    } catch (error) {
      Logger.error(`Error in list provider: ${error.message}`);
      throw error;
    }
  }

  async findOneProvider(
    id: string,
    query?: ApiQueryParamUnifiedModel,
  ): Promise<ApiResponseModel<Provider>> {
    const { relations } = getPagination(query);

    const data = await this.providersRepository.findOne({
      where: { id },
      relations: relations && ['vault', 'addedBy'],
    });
    if (isMissing(data)) {
      throw new NotFoundException(`Record not found with id: ${id}`);
    }
    return { data, metadata: { params: { id } } };
  }

  async updateProvider({
    id,
    updateProviderData,
  }: {
    id: string;
    updateProviderData: UpdateProviderDto;
  }): Promise<ApiResponseModel<Provider>> {
    //Actual provider update
    const updated = await this.providersRepository.update(id, updateProviderData);
    if (!updated?.affected) {
      throw new BadRequestException(`Not updated`);
    }
    //Get updated provider
    const data = await this.providersRepository.findOneBy({
      id,
    });
    return {
      data,
      metadata: {
        params: { id },
        body: updateProviderData,
      },
      message: 'Provider updated successfully',
    };
  }

  async removeProvider(id: string): Promise<ApiResponseModel<Provider>> {
    const deleted = await this.providersRepository.update(id, {
      isDeleted: true,
      isEnabled: false,
    });

    if (!deleted?.affected) {
      throw new BadRequestException(`Not deleted`);
    }
    //Get deleted provider
    const data = await this.providersRepository.findOneBy({
      id,
    });

    return {
      data,
      metadata: { params: { id } },
      message: 'Provider deleted successfully',
    };
  }

  async findProviderByValue(query: Record<string, unknown>): Promise<boolean> {
    try {
      const data = await this.providersRepository.findOne({
        where: { ...query },
      });
      if (isMissing(data)) {
        return false;
      }
      return true;
    } catch (error) {
      Logger.error(`Error in provider operation: ${error.message}`);
      return false;
    }
  }
}
