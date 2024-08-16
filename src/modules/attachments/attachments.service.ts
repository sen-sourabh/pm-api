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
import { VaultsService } from '../vaults/vaults.service';
import { CreateAttachmentDto } from './dtos/create-attachment.dto';
import { ListQueryAttachmentsDto } from './dtos/list-attachment.dto';
import { Attachment } from './entities/attachment.entity';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentsRepository: Repository<Attachment>,
    private readonly filesService: FilesService,
    private readonly vaultsService: VaultsService,
  ) {}

  async uploadAttachments({
    request,
    file,
    createAttachmentData,
  }: {
    request: Request;
    file: Express.Multer.File;
    createAttachmentData: CreateAttachmentDto;
  }): Promise<ApiResponseModel<Attachment>> {
    try {
      //Validate the vault
      if (!isMissing(createAttachmentData?.vault)) {
        await this.#isVaultValid(createAttachmentData);
      }

      //Upload on AWS S3 and in DB
      const newAttachment = await this.#getAttachmentPayload({
        request,
        file,
        createAttachmentData,
      });
      const data = await this.attachmentsRepository.save(newAttachment);

      return {
        data,
        metadata: { body: createAttachmentData },
        message: 'Attachment created successfully',
      };
    } catch (error) {
      Logger.error(`Error in create attachment: ${error.message}`);
      throw error;
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
      throw error;
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

  async #getAttachmentPayload({
    request,
    file,
    createAttachmentData,
  }: {
    request: Request;
    file: Express.Multer.File;
    createAttachmentData: CreateAttachmentDto;
  }): Promise<CreateAttachmentDto> {
    const identifier: string = this.#getIdentifier(request);
    const s3Path: string = this.#getS3Path(createAttachmentData);

    return {
      name: getFileName(file?.originalname),
      fileFormat: getFileExtension(file?.originalname),
      key: getS3FileKey(identifier, file, s3Path),
      url: (await this.filesService.uplaodFileToS3(file, s3Path, identifier))?.data?.url,
      user: request?.['user']?.id,
      ...createAttachmentData,
    } as CreateAttachmentDto;
  }

  #getIdentifier = (request: Request) => {
    const identifier = containsKey({ ...request?.['user'] }, 'id') && request?.['user']?.id;
    if (isMissing(identifier))
      throw new InternalServerErrorException(`Something went wrong. Please login with valid user.`);
    return identifier;
  };

  #getS3Path = (createAttachmentData: CreateAttachmentDto) => {
    return containsKey({ ...createAttachmentData }, 'vault')
      ? getVaultsS3Path(createAttachmentData)
      : getUsersS3Path(createAttachmentData);
  };

  #isVaultValid = async ({ vault }: CreateAttachmentDto) => {
    const isVaultExist = await this.vaultsService.findVaultByValue({ id: vault });
    if (!isVaultExist) throw new NotFoundException(`Vault is invalid with id: ${vault}`);
    return true;
  };
}
