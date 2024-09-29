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
import { ApiXResponses } from '../../shared/decorators/apply-filters/apply-filters.decorator';
import { ApiXResponsesEnum } from '../../shared/enums';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { ApiResponseModel } from '../../shared/interfaces/api-response.interface';
import { ApiQueryParamUnifiedModel } from '../../shared/models/api-query.model';
import { PaginatePipe } from '../../shared/pipes/paginate.pipe';
import { PathParamsPipe } from '../../shared/pipes/path-params.pipe';
import { QueryParamsPipe } from '../../shared/pipes/query-params.pipe';
import { CreateWebhookDto } from './dtos/create-webhook.dto';
import { ListQueryWebhooksDto } from './dtos/list-webhook.dto';
import { UpdateWebhookDto } from './dtos/update-webhook.dto';
import { Webhook } from './entities/webhook.entity';
import { ValidateWebhookPipe } from './pipes/validate-webhook.pipe';
import { WebhooksService } from './webhooks.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @ApiOperation({
    summary: 'Create a webhook',
  })
  @ApiResponse({
    description: 'Return the created webhook',
    status: 201,
    type: Webhook,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.Conflict,
  )
  @HttpCode(201)
  @Post()
  createWebhook(
    @Req() request: Request,
    @Body() CreateWebhookData: CreateWebhookDto,
  ): Promise<ApiResponseModel<Webhook>> {
    return this.webhooksService.createWebhook({ request, CreateWebhookData });
  }

  @ApiOperation({
    summary: 'Get all the webhooks',
  })
  @ApiResponse({
    description: 'Return the list of webhooks',
    type: [Webhook],
    status: 200,
  })
  @ApiXResponses(ApiXResponsesEnum.Unauthorized, ApiXResponsesEnum.BadRequest)
  @UsePipes(new QueryParamsPipe(), new PaginatePipe())
  @HttpCode(200)
  @Get()
  findAllWebhooks(
    @Req() request: Request,
    @Query()
    listQueryWebhooksData?: ListQueryWebhooksDto,
  ): Promise<ApiResponseModel<Webhook[]>> {
    return this.webhooksService.findAllWebhooks({ request, listQueryWebhooksData });
  }

  @ApiOperation({
    summary: 'Get a webhook',
  })
  @ApiResponse({
    description: 'Return the webhook with the given identifier',
    type: Webhook,
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
  findOneWebhook(
    @Req() request: Request,
    @Param('id') id: string,
    @Query() query?: ApiQueryParamUnifiedModel,
  ) {
    return this.webhooksService.findOneWebhook({ request, id, query });
  }

  @ApiOperation({
    summary: 'Update a webhook',
  })
  @ApiResponse({
    description: 'Return the updated webhook with the payload',
    type: Webhook,
    status: 200,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.Conflict,
    ApiXResponsesEnum.NotFound,
  )
  @UsePipes(new ValidationPipe({ whitelist: true }), new PathParamsPipe(), ValidateWebhookPipe)
  @HttpCode(200)
  @Patch(':id')
  updateWebhook(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateWebhookData: UpdateWebhookDto,
  ) {
    return this.webhooksService.updateWebhook({ request, id, updateWebhookData });
  }

  @ApiOperation({
    summary: 'Delete a webhook',
  })
  @ApiResponse({
    description: 'Return the deleted webhook with the given identifier',
    type: Webhook,
    status: 200,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.NotFound,
  )
  @UsePipes(new PathParamsPipe(), ValidateWebhookPipe)
  @HttpCode(200)
  @Delete(':id')
  removeWebhook(@Param('id') id: string) {
    return this.webhooksService.removeWebhook(id);
  }
}
