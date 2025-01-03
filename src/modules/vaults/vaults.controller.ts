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
import { CreateVaultDto } from './dtos/create-vault.dto';
import { ListQueryVaultsDto } from './dtos/list-vault.dto';
import { UpdateVaultDto } from './dtos/update-vault.dto';
import { Vault } from './entities/vault.entity';
import { ValidateVaultPipe } from './pipes/validate-vault.pipe';
import { VaultsService } from './vaults.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Vaults')
@Controller('vaults')
export class VaultsController {
  constructor(private readonly vaultsService: VaultsService) {}

  @ApiOperation({
    summary: 'Create a vault',
  })
  @ApiResponse({
    description: 'Return the created vault',
    status: 201,
    type: Vault,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.Conflict,
  )
  @HttpCode(201)
  @Post()
  createVault(
    @Req() request: Request,
    @Body() CreateVaultData: CreateVaultDto,
  ): Promise<ApiResponseModel<Vault>> {
    return this.vaultsService.createVault({ request, CreateVaultData });
  }

  @ApiOperation({
    summary: 'Get all the vaults',
  })
  @ApiResponse({
    description: 'Return the list of vaults',
    type: [Vault],
    status: 200,
  })
  @ApiXResponses(ApiXResponsesEnum.Unauthorized, ApiXResponsesEnum.BadRequest)
  @UsePipes(new QueryParamsPipe(), new PaginatePipe())
  @HttpCode(200)
  @Get()
  findAllVaults(
    @Req() request: Request,
    @Query()
    listQueryVaultsData?: ListQueryVaultsDto,
  ): Promise<ApiResponseModel<Vault[]>> {
    return this.vaultsService.findAllVaults({ request, listQueryVaultsData });
  }

  @ApiOperation({
    summary: 'Get a vault',
  })
  @ApiResponse({
    description: 'Return the vault with the given identifier',
    type: Vault,
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
  findOneVault(
    @Req() request: Request,
    @Param('id') id: string,
    @Query() query?: ApiQueryParamUnifiedModel,
  ) {
    return this.vaultsService.findOneVault({ request, id, query });
  }

  @ApiOperation({
    summary: 'Update a vault',
  })
  @ApiResponse({
    description: 'Return the updated vault with the payload',
    type: Vault,
    status: 200,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.Conflict,
    ApiXResponsesEnum.NotFound,
  )
  @UsePipes(new ValidationPipe({ whitelist: true }), new PathParamsPipe(), ValidateVaultPipe)
  @HttpCode(200)
  @Patch(':id')
  updateVault(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateVaultData: UpdateVaultDto,
  ) {
    return this.vaultsService.updateVault({ request, id, updateVaultData });
  }

  @ApiOperation({
    summary: 'Delete a vault',
  })
  @ApiResponse({
    description: 'Return the deleted vault with the given identifier',
    type: Vault,
    status: 200,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.NotFound,
  )
  @UsePipes(new PathParamsPipe(), ValidateVaultPipe)
  @HttpCode(200)
  @Delete(':id')
  removeVault(@Req() request: Request, @Param('id') id: string) {
    return this.vaultsService.removeVault({ request, id });
  }
}
