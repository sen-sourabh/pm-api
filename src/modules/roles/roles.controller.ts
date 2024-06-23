import { Controller, Get, HttpCode, Param, Query, UsePipes } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseModel } from '../../core/shared/interfaces/api-response.interface';
import { PathParamsPipe } from '../../core/shared/pipes/path-params.pipe';
import { QueryParamsPipe } from '../../core/shared/pipes/query-params.pipe';
import { ListQueryRolesDto } from './dto/list-role.dto';
import { Role } from './entities/role.entity';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiResponse({
    description: 'returns list of roles',
    type: [Role],
    status: 200,
  })
  @UsePipes(new QueryParamsPipe())
  @Get()
  @HttpCode(200)
  findAllRoles(@Query() listQueryRolesDto?: ListQueryRolesDto): Promise<ApiResponseModel<Role[]>> {
    return this.rolesService.findAllRoles(listQueryRolesDto);
  }

  @ApiResponse({
    description: 'return role by id',
    type: Role,
    status: 200,
  })
  @UsePipes(new PathParamsPipe())
  @Get(':id')
  @HttpCode(200)
  findOneRole(@Param('id') id: number): Promise<ApiResponseModel<Role>> {
    return this.rolesService.findOneRole(+id);
  }
}
