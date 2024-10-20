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
import { CreateUserDto } from './dto/create-user.dto';
import { ListQueryUsersDto } from './dto/list-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ValidateUserPipe } from './pipes/validate-user.pipe';
import { UsersService } from './users.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Create an user',
  })
  @ApiResponse({
    description: 'Return the created user',
    type: User,
    status: 201,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.Conflict,
  )
  @UsePipes(ValidateUserPipe)
  @HttpCode(201)
  @Post()
  createUser(
    @Req() request: Request,
    @Body() createUserData: CreateUserDto,
  ): Promise<ApiResponseModel<User>> {
    return this.usersService.createUser({ request, createUserData });
  }

  @ApiOperation({
    summary: 'Get all the users',
  })
  @ApiResponse({
    description: 'Return the list of users',
    type: [User],
    status: 200,
  })
  @ApiXResponses(ApiXResponsesEnum.Unauthorized, ApiXResponsesEnum.BadRequest)
  @UsePipes(new QueryParamsPipe(), new PaginatePipe())
  @HttpCode(200)
  @Get()
  findAllUsers(
    @Req() request: Request,
    @Query()
    listQueryUsersData?: ListQueryUsersDto,
  ): Promise<ApiResponseModel<User[]>> {
    return this.usersService.findAllUsers({ request, listQueryUsersData });
  }

  @ApiOperation({
    summary: 'Get an user',
  })
  @ApiResponse({
    description: 'Return the user with the given identifier',
    type: User,
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
  findOneUser(
    @Req() request: Request,
    @Param('id') id: string,
    @Query() query?: ApiQueryParamUnifiedModel,
  ) {
    return this.usersService.findOneUser({ request, id, query });
  }

  @ApiOperation({
    summary: 'Update an user',
  })
  @ApiResponse({
    description: 'Return the updated user with the payload',
    type: User,
    status: 200,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.Conflict,
    ApiXResponsesEnum.NotFound,
  )
  @UsePipes(new ValidationPipe({ whitelist: true }), new PathParamsPipe(), ValidateUserPipe)
  @HttpCode(200)
  @Patch(':id')
  updateUser(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateUserData: UpdateUserDto,
  ) {
    return this.usersService.updateUser({ request, id, updateUserData });
  }

  @ApiOperation({
    summary: 'Delete an user',
  })
  @ApiResponse({
    description: 'Return the deleted user with the given identifier',
    type: User,
    status: 200,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.NotFound,
  )
  @UsePipes(new PathParamsPipe(), ValidateUserPipe)
  @HttpCode(200)
  @Delete(':id')
  removeUser(@Req() request: Request, @Param('id') id: string) {
    return this.usersService.removeUser({ request, id });
  }
}
