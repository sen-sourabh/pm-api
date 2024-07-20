import { Body, Controller, Get, HttpCode, Post, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiXResponses } from '../../core/shared/decorators/apply-filters/apply-filters.decorator';
import { ApiXResponsesEnum } from '../../core/shared/enums';
import { JwtAuthGuard } from '../../core/shared/guards/jwt-auth.guard';
import { ApiResponseModel } from '../../core/shared/interfaces/api-response.interface';
import { PaginatePipe } from '../../core/shared/pipes/paginate.pipe';
import { QueryParamsPipe } from '../../core/shared/pipes/query-params.pipe';
import { CreateVaultDto } from './dtos/create-vault.dto';
import { ListQueryVaultsDto } from './dtos/list-vault.dto';
import { Vault } from './entities/vault.entity';
import { VaultsService } from './vaults.service';

@UseGuards(JwtAuthGuard)
@ApiTags('Vaults')
@Controller('vaults')
export class VaultsController {
  constructor(private readonly vaultsService: VaultsService) {}

  @ApiResponse({ status: 201, type: Vault })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.Conflict,
  )
  @HttpCode(201)
  @Post()
  createVault(@Body() createVaultDto: CreateVaultDto): Promise<ApiResponseModel<Vault>> {
    return this.vaultsService.createVault(createVaultDto);
  }

  @ApiResponse({
    description: 'returns list of vaults',
    type: [Vault],
    status: 200,
  })
  @ApiXResponses(ApiXResponsesEnum.Unauthorized, ApiXResponsesEnum.BadRequest)
  @UsePipes(new QueryParamsPipe(), new PaginatePipe())
  @HttpCode(200)
  @Get()
  findAllVaults(
    @Query() listQueryVaultsDto?: ListQueryVaultsDto,
  ): Promise<ApiResponseModel<Vault[]>> {
    return this.vaultsService.findAllVaults(listQueryVaultsDto);
  }
}
