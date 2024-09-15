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
import { CacheManagerService } from '../cache-manager/cache-manager.service';
import { WebhookEventEnum } from '../webhooks/enums';
import { WebhooksService } from '../webhooks/webhooks.service';
import { CreateCustomFieldDto } from './dto/create-custom-field.dto';
import { ListQueryCustomFieldsDto } from './dto/list-custom-field.dto';
import { UpdateCustomFieldDto } from './dto/update-custom-field.dto';
import { CustomField } from './entities/custom-field.entity';

@Injectable()
export class CustomFieldsService {
  constructor(
    @InjectRepository(CustomField)
    private readonly customFieldsRepository: Repository<CustomField>,
    private readonly webhooksService: WebhooksService,
    private readonly cacheManagerService: CacheManagerService,
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

      // INFO: Initiate webhook sender on `customField:created` event
      this.webhooksService.prepareToSendWebhooks({
        user: request?.['user']?.id,
        event: WebhookEventEnum.CustomFieldCreated,
        payload: data,
      });

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

  async findAllCustomFields({
    request,
    listQueryCustomFieldsData,
  }: {
    request: Request;
    listQueryCustomFieldsData?: ListQueryCustomFieldsDto;
  }): Promise<ApiResponseModel<CustomField[]>> {
    try {
      // From Cache
      let data = await this.cacheManagerService.cacheGetData(request);
      if (!isMissing(data)) {
        return {
          data,
          metadata: { query: listQueryCustomFieldsData },
        };
      }

      // Not From Cache
      const { skip, take, relations } = getPagination(listQueryCustomFieldsData);

      data = await this.customFieldsRepository.find({
        where: listQueryCustomFieldsData,
        relations: relations && ['addedBy'],
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
        metadata: { query: listQueryCustomFieldsData },
      };
    } catch (error) {
      Logger.error(`Error in list custom field: ${error.message}`);
      throw error;
    }
  }

  async findOneCustomField({
    request,
    id,
    query,
  }: {
    request: Request;
    id: string;
    query?: ApiQueryParamUnifiedModel;
  }): Promise<ApiResponseModel<CustomField>> {
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

    data = await this.customFieldsRepository.findOne({
      where: { id },
      relations: relations && ['addedBy'],
    });
    if (isMissing(data)) {
      throw new NotFoundException(`Record not found with id: ${id}`);
    }

    // Set in Cache
    await this.cacheManagerService.cacheSetData({
      request,
      data,
    });

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

    // INFO: Initiate webhook sender on `customField:updated` event
    this.webhooksService.prepareToSendWebhooks({
      user: request?.['user']?.id,
      event: WebhookEventEnum.CustomFieldUpdated,
      payload: data,
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

  async removeCustomField({
    request,
    id,
  }: {
    request: Request;
    id: string;
  }): Promise<ApiResponseModel<CustomField>> {
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

    // INFO: Initiate webhook sender on `customField:deleted` event
    this.webhooksService.prepareToSendWebhooks({
      user: request?.['user']?.id,
      event: WebhookEventEnum.CustomFieldDeleted,
      payload: data,
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
