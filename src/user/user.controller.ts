import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
  Request,
  Delete,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { query } from 'express';
import { CreateLoginDto } from 'src/dto/login.dto';
import { QueryEnum } from 'src/dto/query.enum';
import { CreateUserDto } from 'src/dto/user.dto';
import { PostService } from 'src/post/post.service';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private postService: PostService,
  ) {}
  @Post()
  @ApiCreatedResponse({ description: 'User Registration Successful' })
  @ApiBadRequestResponse({ description: 'any credential is missing' })
  @ApiBody({ type: CreateUserDto })
  signUp(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.userService.registerUser(
      createUserDto.username,
      createUserDto.age,
      createUserDto.email,
      createUserDto.password,
    );
  }
  //@UseGuards(JwtAuthGuard)
  @Get('/me')
  @ApiBearerAuth()
  async login(@Request() req) {
    return { profile: req.user };
  }
  @Post('/login')
  @ApiOkResponse({ description: 'User Login Successful' })
  @ApiBadRequestResponse({ description: 'Email not provided' })
  @ApiBody({ type: CreateLoginDto })
  async signIn(@Body(new ValidationPipe()) createUserDto: CreateLoginDto) {
    const result = await this.userService.signIn(
      createUserDto.email,
      createUserDto.password,
    );
    return result;
  }
  @Get('/total')
  @ApiOkResponse({ description: 'Users Retrieved' })
  @ApiBadRequestResponse({ description: 'Offset or limit not valid' })
  async getUsers(
    @Query('offset') offset: string,
    @Query('limit') limit: string,
  ) {
    return await this.userService.getUsers(offset, limit);
  }
  @Put('/follow/:id')
  @ApiOkResponse({ description: 'Followed Successfully' })
  @ApiBadRequestResponse({ description: 'Error following' })
  @ApiBody({ type: String })
  async followUser(@Param('id') id: string, @Body('userId') userId: string) {
    return this.userService.followRequest(id, userId);
  }

  @Put('/unfollow/:id')
  @ApiOkResponse({ description: 'Unfollowed Successfully' })
  @ApiBadRequestResponse({ description: 'Error unfollowing' })
  @ApiBody({ type: String })
  async unfollowUser(@Param('id') id: string, @Body('userId') userId: string) {
    return this.userService.unfollowRequest(id, userId);
  }

  @Get('/feed')
  @ApiOkResponse({ description: 'Feed retrieved' })
  @ApiBadRequestResponse({ description: 'Error in getting the feed' })
  @ApiBearerAuth()
  async showUserFeed(@Request() req) {
    const offsetq = req.query.offset ? parseInt(req.query.offset) : 0;
    const limitq = req.query.limit ? parseInt(req.query.limit) : 0;
    const search = req.query.keyword ? req.query.keyword : null;
    console.log(search);

    const result = await this.postService.getFeedData(
      req.user.followings,
      search,
      offsetq,
      limitq,
    );
    return { feed: result };
  }
  @Delete('/delete')
  @ApiOkResponse({ description: 'User Deleted' })
  @ApiBadRequestResponse({ description: 'Deletion unsuccessful' })
  @ApiBearerAuth()
  async deleteUser(@Request() req) {
    const user = req.user.username;
    const result = await this.userService.removeUser(user);
    if (result.deletedCount === 1) {
      return { message: 'Profile Deleted' };
    } else {
      return { error: 'Try Again' };
    }
  }
}
