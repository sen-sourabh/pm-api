import { Controller, Get, HttpCode, Param, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiXResponses } from '../../core/shared/decorators/apply-filters/apply-filters.decorator';
import { ApiXResponsesEnum } from '../../core/shared/enums';
import { JwtAuthGuard } from '../../core/shared/guards/jwt-auth.guard';
import { ApiResponseModel } from '../../core/shared/interfaces/api-response.interface';
import { PaginatePipe } from '../../core/shared/pipes/paginate.pipe';
import { PathParamsPipe } from '../../core/shared/pipes/path-params.pipe';
import { QueryParamsPipe } from '../../core/shared/pipes/query-params.pipe';
import { AccountTypesService } from './account_types.service';
import { ListQueryAccountTypesDto } from './dto/list-account_type.dto';
import { AccountType } from './entities/account_type.entity';

@UseGuards(JwtAuthGuard)
@ApiTags('AccountTypes')
@Controller('account-types')
export class AccountTypesController {
  constructor(private readonly accountTypesService: AccountTypesService) {}

  @ApiResponse({
    description: 'returns list of account types',
    type: [AccountType],
    status: 200,
  })
  @ApiXResponses(ApiXResponsesEnum.Unauthorized, ApiXResponsesEnum.BadRequest)
  @UsePipes(new QueryParamsPipe(), new PaginatePipe())
  @HttpCode(200)
  @Get()
  findAllAccountTypes(
    @Query()
    listQueryAccountTypesDto?: ListQueryAccountTypesDto,
  ): Promise<ApiResponseModel<AccountType[]>> {
    return this.accountTypesService.findAllAccountTypes(listQueryAccountTypesDto);
  }

  @ApiResponse({
    description: 'return account type as per the identifier',
    type: AccountType,
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
  findOneUsertype(@Param('id') id: number) {
    return this.accountTypesService.findOneAccountType(+id);
  }
}
