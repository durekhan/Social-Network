import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { CreatePostDto } from 'src/dto/post.dto';
import { PostService } from './post.service';
import { io } from 'socket.io-client';
//import { EventEmitter2 } from '@nestjs/event-emitter';
@Controller('post')
export class PostController {
  constructor(
    private postService: PostService, //private eventEmitter: EventEmitter2,
  ) {}
  @Post()
  @ApiCreatedResponse({ description: 'Posted Successful' })
  @ApiBadRequestResponse({ description: 'some error occurred' })
  @ApiBody({ type: CreatePostDto })
  async postContent(
    @Request() req,
    @Body(new ValidationPipe()) postDto: CreatePostDto,
  ) {
    const socket = io('http://localhost:3000');
    const data = await this.postService.postData(postDto.content, req.user._id);
    console.log(data);
    socket.emit('msgToServer', { post: data, user: req.user });
    //socket.emit('msgToServer', data);
    return { Post: `${postDto.content} is posted` };
  }
  @Put('/update/:id')
  @ApiCreatedResponse({ description: 'Post updated successfully' })
  @ApiBadRequestResponse({ description: 'error occurred in updation' })
  @ApiBody({ type: CreatePostDto })
  async updatePost(
    @Param('id') id: string,
    @Body(new ValidationPipe()) postDto: CreatePostDto,
  ) {
    console.log(id);
    return this.postService.updatePost(postDto.content, id);
  }

  @Delete('/delete/:id')
  @ApiCreatedResponse({ description: 'Deleted successfully' })
  @ApiBadRequestResponse({ description: 'error occurred in deletion' })
  async deletePost(@Param('id') id: string) {
    return this.postService.deletePost(id);
  }
}
