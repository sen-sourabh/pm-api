import { Controller, Get, HttpCode, Param, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiXResponses } from '../../core/shared/decorators/apply-filters/apply-filters.decorator';
import { ApiXResponsesEnum } from '../../core/shared/enums';
import { JwtAuthGuard } from '../../core/shared/guards/jwt-auth.guard';
import { ApiResponseModel } from '../../core/shared/interfaces/api-response.interface';
import { PaginatePipe } from '../../core/shared/pipes/paginate.pipe';
import { PathParamsPipe } from '../../core/shared/pipes/path-params.pipe';
import { QueryParamsPipe } from '../../core/shared/pipes/query-params.pipe';
import { AccounttypesService } from './accounttypes.service';
import { ListQueryAccounttypesDto } from './dto/list-accounttype.dto';
import { Accounttype } from './entities/accounttype.entity';

@UseGuards(JwtAuthGuard)
@ApiTags('Accounttypes')
@Controller('accounttypes')
export class AccounttypesController {
  constructor(private readonly accounttypesService: AccounttypesService) {}

  @ApiResponse({
    description: 'returns list of accounttypes',
    type: [Accounttype],
    status: 200,
  })
  @ApiXResponses(ApiXResponsesEnum.Unauthorized, ApiXResponsesEnum.BadRequest)
  @UsePipes(new QueryParamsPipe(), new PaginatePipe())
  @HttpCode(200)
  @Get()
  findAllAccounttypes(
    @Query()
    listQueryAccounttypesDto?: ListQueryAccounttypesDto,
  ): Promise<ApiResponseModel<Accounttype[]>> {
    return this.accounttypesService.findAllAccounttypes(listQueryAccounttypesDto);
  }

  @ApiResponse({
    description: 'return accounttype as per the identifier',
    type: Accounttype,
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
    return this.accounttypesService.findOneAccounttype(+id);
  }
}
