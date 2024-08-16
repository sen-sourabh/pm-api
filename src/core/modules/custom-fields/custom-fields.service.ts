import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getPagination } from '../../helpers/serializers';
import { isMissing } from '../../helpers/validations';
import { OrderEnum } from '../../shared/enums';
import { ApiResponseModel } from '../../shared/interfaces/api-response.interface';
import { ApiQueryParamUnifiedModel } from '../../shared/models/api-query.model';
import { CreateCustomFieldDto } from './dto/create-custom-field.dto';
import { ListQueryCustomFieldsDto } from './dto/list-custom-field.dto';
import { UpdateCustomFieldDto } from './dto/update-custom-field.dto';
import { CustomField } from './entities/custom-field.entity';

@Injectable()
export class CustomFieldsService {
  constructor(
    @InjectRepository(CustomField)
    private readonly customFieldsRepository: Repository<CustomField>,
  ) {}

  async createCustomField({
    request,
    createCustomFieldData,
  }: {
    request: Request;
    createCustomFieldData: CreateCustomFieldDto;
  }): Promise<ApiResponseModel<CustomField>> {
    try {
      //Verify uniqueness of custom_field name within the user
      await this.#checkCustomFieldNameIsUnique({
        key: createCustomFieldData?.['key'],
        addedBy: request?.['user']?.id,
      });

      const newCustomField = this.customFieldsRepository.create({
        ...createCustomFieldData,
        addedBy: request?.['user']?.id,
      });
      const data = await this.customFieldsRepository.save(newCustomField);
      return {
        data,
        metadata: { body: createCustomFieldData },
        message: 'CustomField created successfully',
      };
    } catch (error) {
      Logger.error(`Error in create custom field: ${error.message}`);
      throw error;
    }
  }

  async findAllCustomFields(
    query?: ListQueryCustomFieldsDto,
  ): Promise<ApiResponseModel<CustomField[]>> {
    try {
      const { skip, take, relations } = getPagination(query);

      const data = await this.customFieldsRepository.find({
        where: query,
        relations: relations && ['addedBy'],
        skip,
        take,
        order: { updatedAt: OrderEnum.DESC },
      });

      return {
        data,
        metadata: { query },
      };
    } catch (error) {
      Logger.error(`Error in list custom field: ${error.message}`);
      throw error;
    }
  }

  async findOneCustomField(
    id: string,
    query?: ApiQueryParamUnifiedModel,
  ): Promise<ApiResponseModel<CustomField>> {
    const { relations } = getPagination(query);

    const data = await this.customFieldsRepository.findOne({
      where: { id },
      relations: relations && ['addedBy'],
    });
    if (isMissing(data)) {
      throw new NotFoundException(`Record not found with id: ${id}`);
    }
    return { data, metadata: { params: { id } } };
  }

  async updateCustomField({
    request,
    id,
    updateCustomFieldData,
  }: {
    request: Request;
    id: string;
    updateCustomFieldData: UpdateCustomFieldDto;
  }): Promise<ApiResponseModel<CustomField>> {
    //Verify uniqueness of custom_field name within the user
    if (!isMissing(updateCustomFieldData?.name)) {
      await this.#checkCustomFieldNameIsUnique({
        key: updateCustomFieldData?.['key'],
        addedBy: request?.['user']?.id,
      });
    }

    //Actual custom field update
    const updated = await this.customFieldsRepository.update(id, updateCustomFieldData);
    if (!updated?.affected) {
      throw new BadRequestException(`Not updated`);
    }
    //Get updated custom field
    const data = await this.customFieldsRepository.findOneBy({
      id,
    });
    return {
      data,
      metadata: {
        params: { id },
        body: updateCustomFieldData,
      },
      message: 'CustomField updated successfully',
    };
  }

  async removeCustomField(id: string): Promise<ApiResponseModel<CustomField>> {
    const deleted = await this.customFieldsRepository.update(id, {
      isDeleted: true,
      isEnabled: false,
    });
    if (!deleted?.affected) {
      throw new BadRequestException(`Not deleted`);
    }
    //Get deleted custom field
    const data = await this.customFieldsRepository.findOneBy({
      id,
    });
    return {
      data,
      metadata: { params: { id } },
      message: 'CustomField deleted successfully',
    };
  }

  async findCustomFieldByValue(query: Record<string, unknown>): Promise<boolean> {
    try {
      const data = await this.customFieldsRepository.findOne({
        where: { ...query },
      });
      if (isMissing(data)) {
        return false;
      }
      return true;
    } catch (error) {
      Logger.error(`Error in custom field operation: ${error.message}`);
      return false;
    }
  }

  #checkCustomFieldNameIsUnique = async ({ key, addedBy }: { key?: string; addedBy?: string }) => {
    const isNameUnique = await this.findCustomFieldByValue({
      key,
      addedBy,
    });
    if (isNameUnique) {
      throw new ConflictException(`Name should be unique`);
    }
    return true;
  };
}
