import { Controller, Get, HttpCode, Param, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiXResponses } from '../../core/shared/decorators/apply-filters/apply-filters.decorator';
import { ApiXResponsesEnum } from '../../core/shared/enums';
import { JwtAuthGuard } from '../../core/shared/guards/jwt-auth.guard';
import { ApiResponseModel } from '../../core/shared/interfaces/api-response.interface';
import { PaginatePipe } from '../../core/shared/pipes/paginate.pipe';
import { PathParamsPipe } from '../../core/shared/pipes/path-params.pipe';
import { QueryParamsPipe } from '../../core/shared/pipes/query-params.pipe';
import { ListQueryRolesDto } from './dto/list-role.dto';
import { Role } from './entities/role.entity';
import { RolesService } from './roles.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({
    summary: 'Get all the roles',
  })
  @ApiResponse({
    description: 'Return the list of roles',
    type: [Role],
    status: 200,
  })
  @ApiXResponses(ApiXResponsesEnum.Unauthorized, ApiXResponsesEnum.BadRequest)
  @UsePipes(new QueryParamsPipe(), new PaginatePipe())
  @HttpCode(200)
  @Get()
  findAllRoles(
    @Query()
    listQueryRolesDto?: ListQueryRolesDto,
  ): Promise<ApiResponseModel<Role[]>> {
    return this.rolesService.findAllRoles(listQueryRolesDto);
  }

  @ApiOperation({
    summary: 'Get a role',
  })
  @ApiResponse({
    description: 'Return the role with the given identifier',
    type: Role,
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
  findOneRole(@Param('id') id: number): Promise<ApiResponseModel<Role>> {
    return this.rolesService.findOneRole(+id);
  }
}
