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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
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

  @ApiResponse({ status: 201, type: ProviderFieldAssociation })
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

  @ApiResponse({
    description: 'returns list of provider field associations',
    type: [ProviderFieldAssociation],
    status: 200,
  })
  @ApiXResponses(ApiXResponsesEnum.Unauthorized, ApiXResponsesEnum.BadRequest)
  @UsePipes(new QueryParamsPipe(), new PaginatePipe())
  @HttpCode(200)
  @Get()
  findAllProviderFieldAssociations(
    @Query()
    listQueryProviderFieldAssociationsDto?: ListQueryProviderFieldAssociationsDto,
  ): Promise<ApiResponseModel<ProviderFieldAssociation[]>> {
    return this.providerFieldAssociationsService.findAllProviderFieldAssociations(
      listQueryProviderFieldAssociationsDto,
    );
  }

  @ApiResponse({
    description: 'return provider field association as per the identifier',
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
    @Param('id') id: string,
    @Query() query?: ApiQueryParamUnifiedModel,
  ) {
    return this.providerFieldAssociationsService.findOneProviderFieldAssociation(id, query);
  }

  @ApiResponse({
    description: 'return updated provider field association as per the identifier',
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
    @Param('id') id: string,
    @Body() updateProviderFieldAssociationDto: UpdateProviderFieldAssociationDto,
  ) {
    return this.providerFieldAssociationsService.updateProviderFieldAssociation(
      id,
      updateProviderFieldAssociationDto,
    );
  }

  @ApiResponse({
    description: 'return deleted provider field association as per the identifier',
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
  removeProviderFieldAssociation(@Param('id') id: string) {
    return this.providerFieldAssociationsService.removeProviderFieldAssociation(id);
  }
}
