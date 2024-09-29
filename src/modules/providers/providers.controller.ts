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
import { CreateProviderDto } from './dtos/create-provider.dto';
import { ListQueryProvidersDto } from './dtos/list-provider.dto';
import { UpdateProviderDto } from './dtos/update-provider.dto';
import { Provider } from './entities/provider.entity';
import { ValidateProviderPipe } from './pipes/validate-provider.pipe';
import { ProvidersService } from './providers.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Providers')
@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @ApiOperation({
    summary: 'Create a provider',
  })
  @ApiResponse({
    description: 'Return the created provider',
    status: 201,
    type: Provider,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.Conflict,
  )
  @UsePipes(ValidateProviderPipe)
  @HttpCode(201)
  @Post()
  createProvider(
    @Req() request: Request,
    @Body() createProviderData: CreateProviderDto,
  ): Promise<ApiResponseModel<Provider>> {
    return this.providersService.createProvider({ request, createProviderData });
  }

  @ApiOperation({
    summary: 'Get all the providers',
  })
  @ApiResponse({
    description: 'Return the list of providers',
    type: [Provider],
    status: 200,
  })
  @ApiXResponses(ApiXResponsesEnum.Unauthorized, ApiXResponsesEnum.BadRequest)
  @UsePipes(new QueryParamsPipe(), new PaginatePipe())
  @HttpCode(200)
  @Get()
  findAllProviders(
    @Req() request: Request,
    @Query()
    listQueryProvidersData?: ListQueryProvidersDto,
  ): Promise<ApiResponseModel<Provider[]>> {
    return this.providersService.findAllProviders({ request, listQueryProvidersData });
  }

  @ApiOperation({
    summary: 'Get a provider',
  })
  @ApiResponse({
    description: 'Return the provider with the given identifier',
    type: Provider,
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
  findOneProvider(
    @Req() request: Request,
    @Param('id') id: string,
    @Query() query?: ApiQueryParamUnifiedModel,
  ) {
    return this.providersService.findOneProvider({ request, id, query });
  }

  @ApiOperation({
    summary: 'Update a provider',
  })
  @ApiResponse({
    description: 'Return the updated provider with the payload',
    type: Provider,
    status: 200,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.Conflict,
    ApiXResponsesEnum.NotFound,
  )
  @UsePipes(new ValidationPipe({ whitelist: true }), new PathParamsPipe(), ValidateProviderPipe)
  @HttpCode(200)
  @Patch(':id')
  updateProvider(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateProviderData: UpdateProviderDto,
  ) {
    return this.providersService.updateProvider({ request, id, updateProviderData });
  }

  @ApiOperation({
    summary: 'Delete a provider',
  })
  @ApiResponse({
    description: 'Return the deleted provider with the given identifier',
    type: Provider,
    status: 200,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.NotFound,
  )
  @UsePipes(new PathParamsPipe(), ValidateProviderPipe)
  @HttpCode(200)
  @Delete(':id')
  removeProvider(@Req() request: Request, @Param('id') id: string) {
    return this.providersService.removeProvider({ request, id });
  }
}
