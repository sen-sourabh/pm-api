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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiXResponses } from '../../core/shared/decorators/apply-filters/apply-filters.decorator';
import { ApiXResponsesEnum } from '../../core/shared/enums';
import { JwtAuthGuard } from '../../core/shared/guards/jwt-auth.guard';
import { ApiResponseModel } from '../../core/shared/interfaces/api-response.interface';
import { ApiQueryParamUnifiedModel } from '../../core/shared/models/api-query.model';
import { PaginatePipe } from '../../core/shared/pipes/paginate.pipe';
import { PathParamsPipe } from '../../core/shared/pipes/path-params.pipe';
import { QueryParamsPipe } from '../../core/shared/pipes/query-params.pipe';
import { CreateProviderFieldAssociationDto } from './dtos/create-provider_field_association.dto';
import { ListQueryProviderFieldAssociationsDto } from './dtos/list-provider_field_association.dto';
import { UpdateProviderFieldAssociationDto } from './dtos/update-provider_field_association.dto';
import { ProviderFieldAssociation } from './entities/provider_field_association.entity';
import { ProviderFieldAssociationsService } from './provider_field_associations.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Provider Field Associations')
@Controller('provider-field-associations')
export class ProviderFieldAssociationsController {
  constructor(
    private readonly providerFieldAssociationsService: ProviderFieldAssociationsService,
  ) {}

  @ApiOperation({
    summary: 'Create a provider_field_association',
  })
  @ApiResponse({
    description: 'Return the created provider_field_association',
    status: 201,
    type: ProviderFieldAssociation,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.Conflict,
  )
  @HttpCode(201)
  @Post()
  createProviderFieldAssociation(
    @Req() request: Request,
    @Body() createProviderFieldAssociationData: CreateProviderFieldAssociationDto,
  ): Promise<ApiResponseModel<ProviderFieldAssociation>> {
    return this.providerFieldAssociationsService.createProviderFieldAssociation({
      request,
      createProviderFieldAssociationData,
    });
  }

  @ApiOperation({
    summary: 'Get all the provider_field_associations',
  })
  @ApiResponse({
    description: 'Return the list of provider_field_associations',
    type: [ProviderFieldAssociation],
    status: 200,
  })
  @ApiXResponses(ApiXResponsesEnum.Unauthorized, ApiXResponsesEnum.BadRequest)
  @UsePipes(new QueryParamsPipe(), new PaginatePipe())
  @HttpCode(200)
  @Get()
  findAllProviderFieldAssociations(
    @Req() request: Request,
    @Query()
    listQueryProviderFieldAssociationsData?: ListQueryProviderFieldAssociationsDto,
  ): Promise<ApiResponseModel<ProviderFieldAssociation[]>> {
    return this.providerFieldAssociationsService.findAllProviderFieldAssociations({
      request,
      listQueryProviderFieldAssociationsData,
    });
  }

  @ApiOperation({
    summary: 'Get a provider_field_association',
  })
  @ApiResponse({
    description: 'Return the provider_field_association with the given identifier',
    type: ProviderFieldAssociation,
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
  findOneProviderFieldAssociation(
    @Req() request: Request,
    @Param('id') id: string,
    @Query() query?: ApiQueryParamUnifiedModel,
  ) {
    return this.providerFieldAssociationsService.findOneProviderFieldAssociation({
      request,
      id,
      query,
    });
  }

  @ApiOperation({
    summary: 'Update a provider_field_association',
  })
  @ApiResponse({
    description: 'Return the updated provider_field_association with the payload',
    type: ProviderFieldAssociation,
    status: 200,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.Conflict,
    ApiXResponsesEnum.NotFound,
  )
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(200)
  @Patch(':id')
  updateProviderFieldAssociation(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateProviderFieldAssociationData: UpdateProviderFieldAssociationDto,
  ) {
    return this.providerFieldAssociationsService.updateProviderFieldAssociation({
      request,
      id,
      updateProviderFieldAssociationData,
    });
  }

  @ApiOperation({
    summary: 'Delete a provider_field_association',
  })
  @ApiResponse({
    description: 'Return the deleted provider_field_association with the given identifier',
    type: ProviderFieldAssociation,
    status: 200,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.NotFound,
  )
  @UsePipes(new PathParamsPipe())
  @HttpCode(200)
  @Delete(':id')
  removeProviderFieldAssociation(@Req() request: Request, @Param('id') id: string) {
    return this.providerFieldAssociationsService.removeProviderFieldAssociation({ request, id });
  }
}
