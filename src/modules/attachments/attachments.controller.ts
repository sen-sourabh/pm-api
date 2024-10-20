import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseFilePipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FILE_VALIDATORS } from '../../core/modules/files/constants';
import { ApiXResponses } from '../../core/shared/decorators/apply-filters/apply-filters.decorator';
import { ApiXResponsesEnum } from '../../core/shared/enums';
import { JwtAuthGuard } from '../../core/shared/guards/jwt-auth.guard';
import { ApiResponseModel } from '../../core/shared/interfaces/api-response.interface';
import { ApiQueryParamUnifiedModel } from '../../core/shared/models/api-query.model';
import { PaginatePipe } from '../../core/shared/pipes/paginate.pipe';
import { PathParamsPipe } from '../../core/shared/pipes/path-params.pipe';
import { QueryParamsPipe } from '../../core/shared/pipes/query-params.pipe';
import { AttachmentsService } from './attachments.service';
import { CreateAttachmentDto } from './dtos/create-attachment.dto';
import { ListQueryAttachmentsDto } from './dtos/list-attachment.dto';
import { Attachment } from './entities/attachment.entity';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Attachments')
@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @ApiOperation({
    summary: 'Create/Update an attachment',
  })
  @ApiResponse({
    description: 'Return the created attachment',
    type: Attachment,
    status: 200,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.Conflict,
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateAttachmentDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(200)
  @Post()
  upsertAttachment(
    @Req() request: Request,
    @UploadedFile(new ParseFilePipe(FILE_VALIDATORS))
    file: Express.Multer.File,
    @Body() createAttachmentData: CreateAttachmentDto,
  ): Promise<ApiResponseModel<Attachment>> {
    return this.attachmentsService.uploadAttachments({
      request,
      file,
      createAttachmentData,
    });
  }

  @ApiOperation({
    summary: 'Get all the attachments',
  })
  @ApiResponse({
    description: 'Return the list of attachments',
    type: [Attachment],
    status: 200,
  })
  @ApiXResponses(ApiXResponsesEnum.Unauthorized, ApiXResponsesEnum.BadRequest)
  @UsePipes(new QueryParamsPipe(), new PaginatePipe())
  @HttpCode(200)
  @Get()
  findAllAttachments(
    @Req() request: Request,
    @Query()
    listQueryAttachmentsData?: ListQueryAttachmentsDto,
  ): Promise<ApiResponseModel<Attachment[]>> {
    return this.attachmentsService.findAllAttachments({ request, listQueryAttachmentsData });
  }

  @ApiOperation({
    summary: 'Get a attachment',
  })
  @ApiResponse({
    description: 'Return the attachment with the given identifier',
    type: Attachment,
    status: 200,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.NotFound,
  )
  @UsePipes(new PathParamsPipe())
  @HttpCode(200)
  @Get(':id')
  findOneAttachment(
    @Req() request: Request,
    @Param('id') id: string,
    @Query() query?: ApiQueryParamUnifiedModel,
  ) {
    return this.attachmentsService.findOneAttachment({ request, id, query });
  }
}
