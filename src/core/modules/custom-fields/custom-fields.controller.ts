import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiXResponses } from '../../shared/decorators/apply-filters/apply-filters.decorator';
import { ApiXResponsesEnum } from '../../shared/enums';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { ApiResponseModel } from '../../shared/interfaces/api-response.interface';
import { ApiQueryParamUnifiedModel } from '../../shared/models/api-query.model';
import { PaginatePipe } from '../../shared/pipes/paginate.pipe';
import { PathParamsPipe } from '../../shared/pipes/path-params.pipe';
import { QueryParamsPipe } from '../../shared/pipes/query-params.pipe';
import { CustomFieldsService } from './custom-fields.service';
import { CreateCustomFieldDto } from './dto/create-custom-field.dto';
import { ListQueryCustomFieldsDto } from './dto/list-custom-field.dto';
import { UpdateCustomFieldDto } from './dto/update-custom-field.dto';
import { CustomField } from './entities/custom-field.entity';
import { BodyParserPipe } from './pipes/body-parser.pipe';
import { ValidateCustomFieldPipe } from './pipes/validate-custom-field.pipe';

@UseGuards(JwtAuthGuard)
@ApiTags('Custom Fields')
@Controller('custom-fields')
export class CustomFieldsController {
  constructor(private readonly customFieldsService: CustomFieldsService) {}

  @ApiResponse({ status: 201, type: CustomField })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.Conflict,
  )
  @UsePipes(new ValidationPipe({ whitelist: true }), new BodyParserPipe())
  @HttpCode(201)
  @Post()
  createCustomField(
    @Req() request: Request,
    @Body() createCustomFieldData: CreateCustomFieldDto,
  ): Promise<ApiResponseModel<CustomField>> {
    return this.customFieldsService.createCustomField({ request, createCustomFieldData });
  }

  @ApiResponse({
    description: 'returns list of custom fields',
    type: [CustomField],
    status: 200,
  })
  @ApiXResponses(ApiXResponsesEnum.Unauthorized, ApiXResponsesEnum.BadRequest)
  @UsePipes(new QueryParamsPipe(), new PaginatePipe())
  @HttpCode(200)
  @Get()
  findAllCustomFields(
    @Query()
    listQueryCustomFieldsDto?: ListQueryCustomFieldsDto,
  ): Promise<ApiResponseModel<CustomField[]>> {
    return this.customFieldsService.findAllCustomFields(listQueryCustomFieldsDto);
  }

  @ApiResponse({
    description: 'return custom field as per the identifier',
    type: CustomField,
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
  findOneCustomField(@Param('id') id: string, @Query() query?: ApiQueryParamUnifiedModel) {
    return this.customFieldsService.findOneCustomField(id, query);
  }

  @ApiResponse({
    description: 'return updated custom field as per the identifier',
    type: CustomField,
    status: 200,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.Conflict,
    ApiXResponsesEnum.NotFound,
  )
  @UsePipes(new ValidationPipe({ whitelist: true }), new PathParamsPipe(), ValidateCustomFieldPipe)
  @HttpCode(200)
  @Patch(':id')
  updateCustomField(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateCustomFieldData: UpdateCustomFieldDto,
  ) {
    return this.customFieldsService.updateCustomField({ request, id, updateCustomFieldData });
  }

  @ApiResponse({
    description: 'return deleted custom field as per the identifier',
    type: CustomField,
    status: 200,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.NotFound,
  )
  @UsePipes(new PathParamsPipe(), ValidateCustomFieldPipe)
  @HttpCode(200)
  @Delete(':id')
  removeCustomField(@Param('id') id: string) {
    return this.customFieldsService.removeCustomField(id);
  }
}
