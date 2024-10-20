/* eslint-disable prettier/prettier */
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
import { CreatePlanDto } from '../dto/plans/create-plan.dto';
import { ListQueryPlansDto } from '../dto/plans/list-plan.dto';
import { UpdatePlanDto } from '../dto/plans/update-plan.dto';
import { Plan } from '../entities/plan.entity';
import { ValidatePlanPipe } from './pipes/validate-plan.pipe';
import { PlansService } from './plan.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Plans')
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @ApiOperation({
    summary: 'Create a plan',
  })
  @ApiResponse({
    description: 'Return the created plan',
    status: 201,
    type: Plan,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.Conflict,
  )
  @HttpCode(201)
  @Post()
  createPlan(@Req() request: Request, @Body() createPlanData: CreatePlanDto) {
    return this.plansService.createPlan({
      request,
      createPlanData,
    });
  }

  @ApiOperation({
    summary: 'Get all the plans',
  })
  @ApiResponse({
    description: 'Return the list of plans',
    type: [Plan],
    status: 200,
  })
  @ApiXResponses(ApiXResponsesEnum.Unauthorized, ApiXResponsesEnum.BadRequest)
  @UsePipes(new QueryParamsPipe(), new PaginatePipe())
  @HttpCode(200)
  @Get()
  findAllPlans(
    @Req() request: Request,
    @Query()
    listQueryPlansData?: ListQueryPlansDto,
  ): Promise<ApiResponseModel<Plan[]>> {
    return this.plansService.findAllPlans({ request, listQueryPlansData });
  }

  @ApiOperation({
    summary: 'Get a plan',
  })
  @ApiResponse({
    description: 'Return the plan with the given identifier',
    type: Plan,
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
  findOnePlan(
    @Req() request: Request,
    @Param('id') id: string,
    @Query() query?: ApiQueryParamUnifiedModel,
  ) {
    return this.plansService.findOnePlan({ request, id, query });
  }

  @ApiOperation({
    summary: 'Update a plan',
  })
  @ApiResponse({
    description: 'Return the updated plan with the payload',
    type: Plan,
    status: 200,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.Conflict,
    ApiXResponsesEnum.NotFound,
  )
  @UsePipes(new ValidationPipe({ whitelist: true }), new PathParamsPipe(), ValidatePlanPipe)
  @HttpCode(200)
  @Patch(':id')
  updatePlan(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updatePlanData: UpdatePlanDto,
  ) {
    return this.plansService.updatePlan({ request, id, updatePlanData });
  }

  @ApiOperation({
    summary: 'Delete a plan',
  })
  @ApiResponse({
    description: 'Return the deleted plan with the given identifier',
    type: Plan,
    status: 200,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.NotFound,
  )
  @UsePipes(new PathParamsPipe(), ValidatePlanPipe)
  @HttpCode(200)
  @Delete(':id')
  removePlan(@Req() request: Request, @Param('id') id: string) {
    return this.plansService.removePlan({ request, id });
  }
}
