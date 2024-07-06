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
import { PaginatePipe } from '../../core/shared/pipes/paginate.pipe';
import { PathParamsPipe } from '../../core/shared/pipes/path-params.pipe';
import { QueryParamsPipe } from '../../core/shared/pipes/query-params.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { ListQueryUsersDto } from './dto/list-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { BodyParserPipe } from './pipes/body-parser.pipe';
import { ValidateUserPipe } from './pipes/validate-user.pipe';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({ status: 201, type: User })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.Conflict,
  )
  @UsePipes(ValidateUserPipe, new BodyParserPipe())
  @HttpCode(201)
  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Promise<ApiResponseModel<User>> {
    return this.usersService.createUser(createUserDto);
  }

  @ApiResponse({
    description: 'returns list of users',
    type: [User],
    status: 200,
  })
  @ApiXResponses(ApiXResponsesEnum.Unauthorized, ApiXResponsesEnum.BadRequest)
  @UsePipes(new QueryParamsPipe(), new PaginatePipe())
  @HttpCode(200)
  @Get()
  findAllUsers(@Query() listQueryUsersDto?: ListQueryUsersDto): Promise<ApiResponseModel<User[]>> {
    return this.usersService.findAllUsers(listQueryUsersDto);
  }

  @ApiResponse({
    description: 'return user as per the identifier',
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
  findOneUser(@Param('id') id: string) {
    return this.usersService.findOneUser(id);
  }

  @ApiResponse({
    description: 'return update user as per the identifier',
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
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @ApiResponse({
    description: 'return deleted user as per the identifier',
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
  removeUser(@Param('id') id: string) {
    return this.usersService.removeUser(id);
  }
}
