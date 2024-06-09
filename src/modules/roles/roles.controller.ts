import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseModel } from '../../core/shared/interfaces/api-response.interface';
import { CreateRoleDto } from './dto/create.dto';
import { ListQueryRolesDto } from './dto/list.dto';
import { UpdateRoleDto } from './dto/update.dto';
import { Role } from './entities/role.entity';
import { RolesQueryParamsPipe } from './pipes/roles-query-params.pipe';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(createRoleDto);
  }

  @ApiResponse({
    description: 'returns list of roles',
    type: [Role],
    status: 200,
  })
  @Get()
  @HttpCode(200)
  findAllRoles(
    @Query(new RolesQueryParamsPipe()) listQueryRolesDto?: ListQueryRolesDto,
  ): Promise<ApiResponseModel<Role[]>> {
    return this.rolesService.findAllRoles(listQueryRolesDto);
  }

  @ApiResponse({
    description: 'return role by id',
    type: Role,
    status: 200,
  })
  @Get(':id')
  @HttpCode(200)
  findOneRole(@Param('id') id: string) {
    return this.rolesService.findOneRole(+id);
  }

  @Patch(':id')
  updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.updateRole(+id, updateRoleDto);
  }

  @Delete(':id')
  removeRole(@Param('id') id: string) {
    return this.rolesService.removeRole(+id);
  }
}
