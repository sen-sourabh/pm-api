import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseModel } from '../../core/shared/models/api-response.model';
import { CreateRoleDto } from './dto/create.dto';
import { ListQueryRolesDto } from './dto/list.dto';
import { UpdateRoleDto } from './dto/update.dto';
import { Role } from './entities/role.entity';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @ApiResponse({
    description: 'returns list of roles',
    type: ApiResponseModel,
    status: 200,
  })
  @Get()
  @HttpCode(200)
  findAll(@Query() listQueryRolesDto?: ListQueryRolesDto) {
    // console.log("listQueryRolesDto: ", listQueryRolesDto);
    return this.rolesService.findAll(listQueryRolesDto);
  }

  @ApiResponse({
    description: 'return role by id',
    type: Role,
    status: 200,
  })
  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
