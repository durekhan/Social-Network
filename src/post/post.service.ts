import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CreatePostDto } from 'src/dto/post.dto';
import { CreateUserDto } from 'src/dto/user.dto';
import { User } from 'src/user/user.model';
import { Post } from './post.model';
@Injectable()
export class PostService {
  constructor(@InjectModel('Post') private readonly postModel: Model<Post>) {}
  async postData(content: string, userId: ObjectId) {
    const newPost = new this.postModel({
      content: content,
      user: userId,
    });
    return await newPost.save();
  }
  async getFeedData(
    following: User[],
    keyword: string,
    offset: number,
    limit: number,
  ) {
    if (offset <= 0 || limit <= 0) {
      throw new HttpException(
        'offset or limit not valid',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      let posts;
      if (keyword) {
        posts = await this.postModel
          .find({
            user: { $in: following },
            $text: { $search: keyword },
          })
          .skip(offset - 1)
          .limit(limit)
          .sort({ createdAt: 1 })
          .populate('user', 'username');
      } else {
        posts = await this.postModel
          .find({ user: { $in: following } })
          .skip(offset - 1)
          .limit(limit)
          .sort({ createdAt: 1 })
          .populate('user', 'username');
      }
      if (posts.length === 0) {
        return { message: 'no posts available for this keyword' };
      }
      const count = posts.length;
      console.log(count);
      const page = offset + '/' + Math.ceil(count / limit + 1);
      const object = {
        post: posts,
        pageNo: page,
      };
      return object;
    } catch (err) {
      return { error: err.message };
    }
  }
  async updatePost(content: string, postId: string) {
    try {
      const postToUpdate = await this.postModel.findByIdAndUpdate(postId, {
        content,
      });
      return { message: `Post ${content} updated` };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
  async deletePost(id: string) {
    try {
      const postToDelete = await this.postModel.findByIdAndDelete(id);
      return postToDelete;
    } catch (err) {
      return err;
    }
  }
}
