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
import { CreateVaultsCollaboratorDto } from './dtos/create-vaults-collaborator.entity';
import { ListQueryVaultsCollaboratorDto } from './dtos/list-vaults-collaborator.entity';
import { UpdateVaultsCollaboratorDto } from './dtos/update-vaults-collaborator.entity';
import { VaultsCollaborator } from './entities/vaults_collaborator.entity';
import { ValidateVaultsCollaboratorPipe } from './pipes/validate-collaborator.pipe';
import { VaultsCollaboratorsService } from './vaults_collaborators.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Vaults Collaborators')
@Controller('vaults-collaborators')
export class VaultsCollaboratorsController {
  constructor(private readonly vaultsCollaboratorsService: VaultsCollaboratorsService) {}

  @ApiOperation({
    summary: 'Create a vaults_collaborator',
  })
  @ApiResponse({
    description: 'Return the created vaults_collaborator',
    status: 201,
    type: VaultsCollaborator,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.Conflict,
  )
  @HttpCode(201)
  @Post()
  createVaultsCollaborator(
    @Req() request: Request,
    @Body() createVaultsCollaboratorData: CreateVaultsCollaboratorDto,
  ): Promise<ApiResponseModel<VaultsCollaborator>> {
    return this.vaultsCollaboratorsService.createVaultsCollaborator({
      request,
      createVaultsCollaboratorData,
    });
  }

  @ApiOperation({
    summary: 'Get all the vaults_collaborators',
  })
  @ApiResponse({
    description: 'Return the list of vaults_collaborators',
    type: [VaultsCollaborator],
    status: 200,
  })
  @ApiXResponses(ApiXResponsesEnum.Unauthorized, ApiXResponsesEnum.BadRequest)
  @UsePipes(new QueryParamsPipe(), new PaginatePipe())
  @HttpCode(200)
  @Get()
  findAllVaultsCollaborators(
    @Req() request: Request,
    @Query()
    listQueryVaultsCollaboratorData?: ListQueryVaultsCollaboratorDto,
  ): Promise<ApiResponseModel<VaultsCollaborator[]>> {
    return this.vaultsCollaboratorsService.findAllVaultsCollaborators({
      request,
      listQueryVaultsCollaboratorData,
    });
  }

  @ApiOperation({
    summary: 'Get a vaults_collaborator',
  })
  @ApiResponse({
    description: 'Return the vaults_collaborator with the given identifier',
    type: VaultsCollaborator,
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
  findOneVaultsCollaborator(
    @Req() request: Request,
    @Param('id') id: string,
    @Query() query?: ApiQueryParamUnifiedModel,
  ) {
    return this.vaultsCollaboratorsService.findOneVaultsCollaborator({ request, id, query });
  }

  @ApiOperation({
    summary: 'Update a vaults_collaborator',
  })
  @ApiResponse({
    description: 'Return the updated vaults_collaborator with the payload',
    type: VaultsCollaborator,
    status: 200,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.Conflict,
    ApiXResponsesEnum.NotFound,
  )
  @UsePipes(
    new ValidationPipe({ whitelist: true }),
    new PathParamsPipe(),
    ValidateVaultsCollaboratorPipe,
  )
  @HttpCode(200)
  @Patch(':id')
  updateVaultsCollaborator(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateVaultsCollaboratorData: UpdateVaultsCollaboratorDto,
  ) {
    return this.vaultsCollaboratorsService.updateVaultsCollaborator({
      request,
      id,
      updateVaultsCollaboratorData,
    });
  }

  @ApiOperation({
    summary: 'Delete a vaults_collaborator',
  })
  @ApiResponse({
    description: 'Return the deleted vaults_collaborator with the given identifier',
    type: VaultsCollaborator,
    status: 200,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.NotFound,
  )
  @UsePipes(new PathParamsPipe(), ValidateVaultsCollaboratorPipe)
  @HttpCode(200)
  @Delete(':id')
  removeVaultsCollaborator(@Req() request: Request, @Param('id') id: string) {
    return this.vaultsCollaboratorsService.removeVaultsCollaborator({ request, id });
  }
}
