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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
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

@UseGuards(JwtAuthGuard)
@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @ApiResponse({ status: 201, type: Webhook })
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

  @ApiResponse({
    description: 'returns list of webhooks',
    type: [Webhook],
    status: 200,
  })
  @ApiXResponses(ApiXResponsesEnum.Unauthorized, ApiXResponsesEnum.BadRequest)
  @UsePipes(new QueryParamsPipe(), new PaginatePipe())
  @HttpCode(200)
  @Get()
  findAllWebhooks(
    @Query()
    listQueryWebhooksDto?: ListQueryWebhooksDto,
  ): Promise<ApiResponseModel<Webhook[]>> {
    return this.webhooksService.findAllWebhooks(listQueryWebhooksDto);
  }

  @ApiResponse({
    description: 'return webhook as per the identifier',
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
  findOneWebhook(@Param('id') id: string, @Query() query?: ApiQueryParamUnifiedModel) {
    return this.webhooksService.findOneWebhook(id, query);
  }

  @ApiResponse({
    description: 'return updated webhook as per the identifier',
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

  @ApiResponse({
    description: 'return deleted webhook as per the identifier',
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

  // @HttpCode(200)
  // @Post()
  // async handleWebhook(@Body() webhookRequest: WebhookRequestDto) {
  //   try {
  //     await this.webhookService.handleWebhook(webhookRequest);
  //   } catch (err) {
  //     console.error('Webhook service error:', err.message);
  //     return 'Webhook service Error';
  //   }

  //   return 'Webhook received successfully';
  // }
}
