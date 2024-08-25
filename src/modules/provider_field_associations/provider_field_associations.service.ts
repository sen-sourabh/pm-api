import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getPagination } from '../../core/helpers/serializers';
import { isMissing } from '../../core/helpers/validations';
import { WebhookEventEnum } from '../../core/modules/webhooks/enums';
import { WebhooksService } from '../../core/modules/webhooks/webhooks.service';
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
    private readonly webhooksService: WebhooksService,
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

      // INFO: Initiate webhook sender on `fieldAssociation:created` event
      this.webhooksService.prepareToSendWebhooks({
        user: request?.['user']?.id,
        event: WebhookEventEnum.FieldAssociationCreated,
        payload: data,
      });

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

  async updateProviderFieldAssociation({
    request,
    id,
    updateProviderFieldAssociationData,
  }: {
    request: Request;
    id: string;
    updateProviderFieldAssociationData: UpdateProviderFieldAssociationDto;
  }): Promise<ApiResponseModel<ProviderFieldAssociation>> {
    //Actual user update
    const updated = await this.providerFieldAssociationsRepository.update(
      id,
      updateProviderFieldAssociationData,
    );
    if (!updated?.affected) {
      throw new BadRequestException(`Not updated`);
    }
    //Get updated user
    const data = await this.providerFieldAssociationsRepository.findOneBy({
      id,
    });

    // INFO: Initiate webhook sender on `fieldAssociation:updated` event
    this.webhooksService.prepareToSendWebhooks({
      user: request?.['user']?.id,
      event: WebhookEventEnum.FieldAssociationUpdated,
      payload: data,
    });

    return {
      data,
      metadata: {
        params: { id },
        body: updateProviderFieldAssociationData,
      },
      message: 'ProviderFieldAssociation updated successfully',
    };
  }

  async removeProviderFieldAssociation({
    request,
    id,
  }: {
    request: Request;
    id: string;
  }): Promise<ApiResponseModel<ProviderFieldAssociation>> {
    const deleted = await this.providerFieldAssociationsRepository.delete(id);
    if (!deleted?.affected) throw new BadRequestException(`Not deleted`);

    // INFO: Initiate webhook sender on `fieldAssociation:deleted` event
    this.webhooksService.prepareToSendWebhooks({
      user: request?.['user']?.id,
      event: WebhookEventEnum.FieldAssociationDeleted,
      payload: { id },
    });

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
