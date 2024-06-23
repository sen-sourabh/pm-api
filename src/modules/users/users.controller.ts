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
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiBadErrorResponseModel,
  ApiConflictErrorResponseModel,
} from '../../core/shared/interfaces/api-error-response.interface';
import { ApiResponseModel } from '../../core/shared/interfaces/api-response.interface';
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
// @UseGuards(ValidateUserGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({
    description: 'returns new created user',
    type: [User],
    status: 201,
  })
  @UsePipes(ValidateUserPipe, BodyParserPipe)
  @HttpCode(201)
  @Post()
  @ApiResponse({ status: 201, type: User })
  @ApiConflictResponse({ status: 409, type: ApiConflictErrorResponseModel })
  @ApiBadRequestResponse({ status: 400, type: ApiBadErrorResponseModel })
  createUser(@Body() createUserDto: CreateUserDto): Promise<ApiResponseModel<User>> {
    console.log('createUserDto: ', createUserDto);
    return this.usersService.createUser(createUserDto);
  }

  @ApiResponse({
    description: 'returns list of users',
    type: [User],
    status: 200,
  })
  @UsePipes(new QueryParamsPipe())
  @Get()
  @HttpCode(200)
  findAllUsers(@Query() listQueryUsersDto?: ListQueryUsersDto): Promise<ApiResponseModel<User[]>> {
    return this.usersService.findAllUsers(listQueryUsersDto);
  }

  @HttpCode(200)
  @Get(':id')
  findOneUser(@Param('id') id: string) {
    return this.usersService.findOneUser(+id);
  }

  @HttpCode(200)
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(+id, updateUserDto);
  }

  @HttpCode(200)
  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.usersService.removeUser(+id);
  }
}
