import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateFilesDto } from '../../core/modules/files/dtos/create-file.dto';
import { EntityFileResponseModel } from '../../core/modules/files/models/file.model';
import { ApiXResponses } from '../../core/shared/decorators/apply-filters/apply-filters.decorator';
import { ApiXResponsesEnum } from '../../core/shared/enums';
import { ApiResponseModel } from '../../core/shared/interfaces/api-response.interface';
import { ApiQueryParamUnifiedModel } from '../../core/shared/models/api-query.model';
import { PaginatePipe } from '../../core/shared/pipes/paginate.pipe';
import { PathParamsPipe } from '../../core/shared/pipes/path-params.pipe';
import { QueryParamsPipe } from '../../core/shared/pipes/query-params.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { ListQueryUsersDto } from './dto/list-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { BodyParserPipe } from './pipes/body-parser.pipe';
import { FileValidationPipe } from './pipes/file-validation.pipe';
import { ValidateUserPipe } from './pipes/validate-user.pipe';
import { UsersService } from './users.service';

// @UseGuards(JwtAuthGuard)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({ status: 201, type: User })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.Conflict,
  )
  @UsePipes(ValidateUserPipe, new BodyParserPipe())
  @HttpCode(201)
  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Promise<ApiResponseModel<User>> {
    return this.usersService.createUser(createUserDto);
  }

  @ApiResponse({
    status: 201,
    type: EntityFileResponseModel,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.Conflict,
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        entityId: {
          type: 'string',
          required: ['true'],
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(FileValidationPipe)
  @HttpCode(201)
  @Post('file')
  createUsersFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 10000000,
          }),
          new FileTypeValidator({
            fileType: '.(png|jpeg|jpg)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() createFileDto: CreateFilesDto,
  ): Promise<ApiResponseModel<EntityFileResponseModel>> {
    return this.usersService.createUsersFile(file, createFileDto);
  }

  @ApiResponse({
    description: 'returns list of users',
    type: [User],
    status: 200,
  })
  @ApiXResponses(ApiXResponsesEnum.Unauthorized, ApiXResponsesEnum.BadRequest)
  @UsePipes(new QueryParamsPipe(), new PaginatePipe())
  @HttpCode(200)
  @Get()
  findAllUsers(
    @Query()
    listQueryUsersDto?: ListQueryUsersDto,
  ): Promise<ApiResponseModel<User[]>> {
    return this.usersService.findAllUsers(listQueryUsersDto);
  }

  @ApiResponse({
    description: 'return user as per the identifier',
    type: User,
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
  findOneUser(@Param('id') id: string, @Query() query?: ApiQueryParamUnifiedModel) {
    return this.usersService.findOneUser(id, query);
  }

  @ApiResponse({
    description: 'return update user as per the identifier',
    type: User,
    status: 200,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.Conflict,
    ApiXResponsesEnum.NotFound,
  )
  @UsePipes(new ValidationPipe({ whitelist: true }), new PathParamsPipe(), ValidateUserPipe)
  @HttpCode(200)
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @ApiResponse({
    description: 'return deleted user as per the identifier',
    type: User,
    status: 200,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.NotFound,
  )
  @UsePipes(new PathParamsPipe(), ValidateUserPipe)
  @HttpCode(200)
  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.usersService.removeUser(id);
  }
}
