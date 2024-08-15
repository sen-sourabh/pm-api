import {
  Controller,
  HttpCode,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { ApiXResponses } from '../../shared/decorators/apply-filters/apply-filters.decorator';
import { ApiXResponsesEnum } from '../../shared/enums';
import { ApiResponseModel } from '../../shared/interfaces/api-response.interface';
import { FILE_VALIDATORS } from './constants';
import { CreateFilesDto } from './dtos/create-file.dto';
import { FilesService } from './files.service';
import { FilesResponseModel } from './models/file.model';

@Controller('files')
export class FilesController {
  constructor(private readonly fileService: FilesService) {}

  @ApiResponse({
    description: 'create a file',
    status: 201,
  })
  @ApiXResponses(ApiXResponsesEnum.Unauthorized, ApiXResponsesEnum.BadRequest)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateFilesDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(201)
  @Post('upload')
  uploadFile(
    @UploadedFile(new ParseFilePipe(FILE_VALIDATORS))
    file: Express.Multer.File,
    // @Body() createFilesDto?: CreateFilesDto,  // INFO: You can pass other variables here via DTO
  ): Promise<ApiResponseModel<FilesResponseModel>> {
    return this.fileService.uplaodFileToS3(file);
  }
}
