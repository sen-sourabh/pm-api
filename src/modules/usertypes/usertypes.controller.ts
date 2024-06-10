import { Controller, Get, HttpCode, Param, Query, UsePipes } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseModel } from '../../core/shared/interfaces/api-response.interface';
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
  @UsePipes(new QueryParamsPipe())
  @Get()
  @HttpCode(200)
  findAllUsertypes(
    @Query() listQueryUsertypesDto?: ListQueryUsertypesDto,
  ): Promise<ApiResponseModel<Usertype[]>> {
    return this.usertypesService.findAllUsertypes(listQueryUsertypesDto);
  }

  @ApiResponse({
    description: 'return usertype by id',
    type: Usertype,
    status: 200,
  })
  @UsePipes(new PathParamsPipe())
  @Get(':id')
  @HttpCode(200)
  findOneUsertype(@Param('id') id: number) {
    return this.usertypesService.findOneUsertype(+id);
  }
}
