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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiXResponses } from '../../core/shared/decorators/apply-filters/apply-filters.decorator';
import { ApiXResponsesEnum } from '../../core/shared/enums';
import { ApiResponseModel } from '../../core/shared/interfaces/api-response.interface';
import { ApiQueryParamUnifiedModel } from '../../core/shared/models/api-query.model';
import { PaginatePipe } from '../../core/shared/pipes/paginate.pipe';
import { PathParamsPipe } from '../../core/shared/pipes/path-params.pipe';
import { QueryParamsPipe } from '../../core/shared/pipes/query-params.pipe';
import { CreateVaultsCollaboratorDto } from './dtos/create-vaults-collaborator.entity';
import { ListQueryVaultsCollaboratorDto } from './dtos/list-vaults-collaborator.entity';
import { UpdateVaultsCollaboratorDto } from './dtos/update-vaults-collaborator.entity';
import { VaultsCollaborator } from './entities/vaults_collaborator.entity';
import { VaultsCollaboratorsService } from './vaults_collaborators.service';

@ApiTags('Vaults Collaborators')
@Controller('vaults-collaborators')
export class VaultsCollaboratorsController {
  constructor(private readonly vaultsCollaboratorsService: VaultsCollaboratorsService) {}

  @ApiResponse({ status: 201, type: VaultsCollaborator })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.Conflict,
  )
  @HttpCode(201)
  @Post()
  createVaultsCollaborator(
    @Body() createVaultsCollaboratorDto: CreateVaultsCollaboratorDto,
  ): Promise<ApiResponseModel<VaultsCollaborator>> {
    return this.vaultsCollaboratorsService.createVaultsCollaborator(createVaultsCollaboratorDto);
  }

  @ApiResponse({
    description: 'returns list of vaults collaborators',
    type: [VaultsCollaborator],
    status: 200,
  })
  @ApiXResponses(ApiXResponsesEnum.Unauthorized, ApiXResponsesEnum.BadRequest)
  @UsePipes(new QueryParamsPipe(), new PaginatePipe())
  @HttpCode(200)
  @Get()
  findAllVaultsCollaborators(
    @Query()
    listQueryVaultsCollaboratorDto?: ListQueryVaultsCollaboratorDto,
  ): Promise<ApiResponseModel<VaultsCollaborator[]>> {
    return this.vaultsCollaboratorsService.findAllVaultsCollaborators(
      listQueryVaultsCollaboratorDto,
    );
  }

  @ApiResponse({
    description: 'return vaults collaborator as per the identifier',
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
  findOneVaultsCollaborator(@Param('id') id: string, @Query() query?: ApiQueryParamUnifiedModel) {
    return this.vaultsCollaboratorsService.findOneVaultsCollaborator(id, query);
  }

  @ApiResponse({
    description: 'return updated vaults collaborator as per the identifier',
    type: VaultsCollaborator,
    status: 200,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.Conflict,
    ApiXResponsesEnum.NotFound,
  )
  @UsePipes(new ValidationPipe({ whitelist: true }), new PathParamsPipe())
  @HttpCode(200)
  @Patch(':id')
  updateVaultsCollaborator(
    @Param('id') id: string,
    @Body() updateVaultsCollaboratorDto: UpdateVaultsCollaboratorDto,
  ) {
    return this.vaultsCollaboratorsService.updateVaultsCollaborator(
      id,
      updateVaultsCollaboratorDto,
    );
  }

  @ApiResponse({
    description: 'return success after deleting vaults collaborator as per the identifier',
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
  @Delete(':id')
  removeVaultsCollaborator(@Param('id') id: string) {
    return this.vaultsCollaboratorsService.removeVaultsCollaborator(id);
  }
}
