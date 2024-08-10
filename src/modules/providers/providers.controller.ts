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
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
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

@UseGuards(JwtAuthGuard)
@ApiTags('Providers')
@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @ApiResponse({ status: 201, type: Provider })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.Conflict,
  )
  @UsePipes(ValidateProviderPipe)
  @HttpCode(201)
  @Post()
  createProvider(
    @Body() createProviderDto: CreateProviderDto,
  ): Promise<ApiResponseModel<Provider>> {
    return this.providersService.createProvider(createProviderDto);
  }

  @ApiResponse({
    description: 'returns list of providers',
    type: [Provider],
    status: 200,
  })
  @ApiXResponses(ApiXResponsesEnum.Unauthorized, ApiXResponsesEnum.BadRequest)
  @UsePipes(new QueryParamsPipe(), new PaginatePipe())
  @HttpCode(200)
  @Get()
  findAllProviders(
    @Query()
    listQueryProvidersDto?: ListQueryProvidersDto,
  ): Promise<ApiResponseModel<Provider[]>> {
    return this.providersService.findAllProviders(listQueryProvidersDto);
  }

  @ApiResponse({
    description: 'return provider as per the identifier',
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
  findOneProvider(@Param('id') id: string, @Query() query?: ApiQueryParamUnifiedModel) {
    return this.providersService.findOneProvider(id, query);
  }

  @ApiResponse({
    description: 'return update provider as per the identifier',
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
  updateProvider(@Param('id') id: string, @Body() updateProviderDto: UpdateProviderDto) {
    return this.providersService.updateProvider(id, updateProviderDto);
  }

  @ApiResponse({
    description: 'return deleted provider as per the identifier',
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
  removeProvider(@Param('id') id: string) {
    return this.providersService.removeProvider(id);
  }
}
