import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getPagination } from '../../core/helpers/serializers';
import { containsKey, isMissing } from '../../core/helpers/validations';
import { FilesService } from '../../core/modules/files/files.service';
import {
  getFileExtension,
  getFileName,
  getS3FileKey,
  getUsersS3Path,
  getVaultsS3Path,
} from '../../core/modules/files/utils';
import { OrderEnum } from '../../core/shared/enums';
import { ApiResponseModel } from '../../core/shared/interfaces/api-response.interface';
import { ApiQueryParamUnifiedModel } from '../../core/shared/models/api-query.model';
import {
  CreateUsersAttachmentDto,
  CreateVaultsAttachmentDto,
  CreateVaultsAttachmentInternalDto,
} from './dtos/create-attachment.dto';
import { ListQueryAttachmentsDto } from './dtos/list-attachment.dto';
import { Attachment } from './entities/attachment.entity';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentsRepository: Repository<Attachment>,
    private readonly filesService: FilesService,
  ) {}

  async uploadAttachments(
    request: Request,
    file: Express.Multer.File,
    createAttachmentData: CreateUsersAttachmentDto | CreateVaultsAttachmentDto,
  ): Promise<ApiResponseModel<Attachment>> {
    try {
      const newAttachment = await this.#getAttachmentPayload(request, file, createAttachmentData);
      const data = await this.attachmentsRepository.save(newAttachment);

      return {
        data,
        metadata: { body: createAttachmentData },
        message: 'Attachment created successfully',
      };
    } catch (error) {
      Logger.error(`Error in create attachment: ${error.message}`);
      throw new InternalServerErrorException(`Error in create attachment: ${error.message}`);
    }
  }

  async findAllAttachments(
    query?: ListQueryAttachmentsDto,
  ): Promise<ApiResponseModel<Attachment[]>> {
    try {
      const { skip, take, relations } = getPagination(query);

      const data = await this.attachmentsRepository.find({
        where: query,
        relations: relations && ['user', 'vault'],
        skip,
        take,
        order: { updatedAt: OrderEnum.DESC },
      });

      return {
        data,
        metadata: { query },
      };
    } catch (error) {
      Logger.error(`Error in list attachment: ${error.message}`);
      throw new InternalServerErrorException(`Error in list attachment: ${error.message}`);
    }
  }

  async findOneAttachment(
    id: string,
    query?: ApiQueryParamUnifiedModel,
  ): Promise<ApiResponseModel<Attachment>> {
    const { relations } = getPagination(query);

    const data = await this.attachmentsRepository.findOne({
      where: { id },
      relations: relations && ['user', 'vault'],
    });
    if (isMissing(data)) {
      throw new NotFoundException(`Record not found with id: ${id}`);
    }
    return { data, metadata: { params: { id } } };
  }

  async #getAttachmentPayload(
    request: Request,
    file: Express.Multer.File,
    createAttachmentData: CreateUsersAttachmentDto | CreateVaultsAttachmentDto,
  ): Promise<CreateVaultsAttachmentInternalDto | CreateVaultsAttachmentInternalDto> {
    const identifier: string = this.#getIdentifier(request);
    const s3Path: string = this.#getS3Path(createAttachmentData);

    return {
      name: getFileName(file?.originalname),
      fileFormat: getFileExtension(file?.originalname),
      key: getS3FileKey(identifier, file, s3Path),
      url: (await this.filesService.uplaodFileToS3(file, s3Path, identifier))?.data?.url,
      ...createAttachmentData,
    } as CreateVaultsAttachmentInternalDto | CreateVaultsAttachmentInternalDto;
  }

  #getIdentifier = (request: Request) => {
    const identifier = containsKey({ ...request?.['user'] }, 'id') && request?.['user']?.['id'];
    if (isMissing(identifier))
      throw new InternalServerErrorException(`Something went wrong. Please login with valid user.`);
    return identifier;
  };

  #getS3Path = (createAttachmentData: CreateUsersAttachmentDto | CreateVaultsAttachmentDto) => {
    return containsKey({ ...createAttachmentData }, 'vault')
      ? getVaultsS3Path(createAttachmentData)
      : getUsersS3Path(createAttachmentData);
  };
}
