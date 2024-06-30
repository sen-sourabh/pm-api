import { Controller, Get, HttpCode, Param, Query, UsePipes } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiXResponses } from '../../core/shared/decorators/apply-filters/apply-filters.decorator';
import { ApiXResponsesEnum } from '../../core/shared/enums';
import { ApiResponseModel } from '../../core/shared/interfaces/api-response.interface';
import { PaginatePipe } from '../../core/shared/pipes/paginate.pipe';
import { PathParamsPipe } from '../../core/shared/pipes/path-params.pipe';
import { QueryParamsPipe } from '../../core/shared/pipes/query-params.pipe';
import { ListQueryUsertypesDto } from './dto/list-usertype.dto';
import { Usertype } from './entities/usertype.entity';
import { UsertypesService } from './usertypes.service';

@ApiTags('Usertypes')
@Controller('usertypes')
export class UsertypesController {
  constructor(private readonly usertypesService: UsertypesService) {}

  @ApiResponse({
    description: 'returns list of usertypes',
    type: [Usertype],
    status: 200,
  })
  @ApiXResponses(ApiXResponsesEnum.Unauthorized, ApiXResponsesEnum.BadRequest)
  @UsePipes(new QueryParamsPipe(), new PaginatePipe())
  @HttpCode(200)
  @Get()
  findAllUsertypes(
    @Query() listQueryUsertypesDto?: ListQueryUsertypesDto,
  ): Promise<ApiResponseModel<Usertype[]>> {
    return this.usertypesService.findAllUsertypes(listQueryUsertypesDto);
  }

  @ApiResponse({
    description: 'return usertype as per the identifier',
    type: Usertype,
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
    return this.usertypesService.findOneUsertype(+id);
  }
}
