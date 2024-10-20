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
import { ApiXResponses } from '../../../shared/decorators/apply-filters/apply-filters.decorator';
import { ApiXResponsesEnum } from '../../../shared/enums';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { ApiResponseModel } from '../../../shared/interfaces/api-response.interface';
import { ApiQueryParamUnifiedModel } from '../../../shared/models/api-query.model';
import { PaginatePipe } from '../../../shared/pipes/paginate.pipe';
import { PathParamsPipe } from '../../../shared/pipes/path-params.pipe';
import { QueryParamsPipe } from '../../../shared/pipes/query-params.pipe';
import { CreateFeatureDto } from '../dto/features/create.feature.dto';
import { ListQueryFeaturesDto } from '../dto/features/list.feature.dto';
import { UpdateFeatureDto } from '../dto/features/update.feature.dto';
import { Feature } from '../entities/feature.entity';
import { FeaturesService } from './feature.service';
import { ValidateFeaturePipe } from './pipes/validate-feature.pipe';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Features')
@Controller('features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @ApiOperation({
    summary: 'Create a feature',
  })
  @ApiResponse({
    description: 'Return the created feature',
    status: 201,
    type: Feature,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.Conflict,
  )
  @HttpCode(201)
  @Post()
  createFeature(@Req() request: Request, @Body() createFeatureData: CreateFeatureDto) {
    return this.featuresService.createFeature({
      request,
      createFeatureData,
    });
  }

  @ApiOperation({
    summary: 'Get all the features',
  })
  @ApiResponse({
    description: 'Return the list of features',
    type: [Feature],
    status: 200,
  })
  @ApiXResponses(ApiXResponsesEnum.Unauthorized, ApiXResponsesEnum.BadRequest)
  @UsePipes(new QueryParamsPipe(), new PaginatePipe())
  @HttpCode(200)
  @Get()
  findAllFeatures(
    @Req() request: Request,
    @Query()
    listQueryFeaturesData?: ListQueryFeaturesDto,
  ): Promise<ApiResponseModel<Feature[]>> {
    return this.featuresService.findAllFeatures({ request, listQueryFeaturesData });
  }

  @ApiOperation({
    summary: 'Get a feature',
  })
  @ApiResponse({
    description: 'Return the feature with the given identifier',
    type: Feature,
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
  findOneFeature(
    @Req() request: Request,
    @Param('id') id: string,
    @Query() query?: ApiQueryParamUnifiedModel,
  ) {
    return this.featuresService.findOneFeature({ request, id, query });
  }

  @ApiOperation({
    summary: 'Update a feature',
  })
  @ApiResponse({
    description: 'Return the updated feature with the payload',
    type: Feature,
    status: 200,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.Conflict,
    ApiXResponsesEnum.NotFound,
  )
  @UsePipes(new ValidationPipe({ whitelist: true }), new PathParamsPipe(), ValidateFeaturePipe)
  @HttpCode(200)
  @Patch(':id')
  updateFeature(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateFeatureData: UpdateFeatureDto,
  ) {
    return this.featuresService.updateFeature({ request, id, updateFeatureData });
  }

  @ApiOperation({
    summary: 'Delete a feature',
  })
  @ApiResponse({
    description: 'Return the deleted feature with the given identifier',
    type: Feature,
    status: 200,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.NotFound,
  )
  @UsePipes(new PathParamsPipe(), ValidateFeaturePipe)
  @HttpCode(200)
  @Delete(':id')
  removeFeature(@Req() request: Request, @Param('id') id: string) {
    return this.featuresService.removeFeature({ request, id });
  }
}
