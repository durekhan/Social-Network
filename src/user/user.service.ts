import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Auth } from 'src/config/auth';
import { AuthService } from 'src/auth/auth.service';
import { User, UserDocument } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly UserModel: Model<User>,
    private auth: AuthService,
  ) {}
  async followRequest(friend: string, user: string) {
    if (user !== friend) {
      try {
        await this.UserModel.updateOne(
          { _id: friend },
          { $push: { followers: user } },
        );
        await this.UserModel.updateOne(
          { _id: user },
          { $push: { followings: friend } },
        );
        return { message: `User: ${friend} followed` };
      } catch (err) {
        return err;
      }
    } else {
      return { message: "You can't follow yourself" };
    }
  }
  async unfollowRequest(friend: string, user: string) {
    if (user !== friend) {
      try {
        const toFollow = await this.UserModel.findById(friend);
        const currentUser = await this.UserModel.findById(user);

        await toFollow.updateOne({ $pull: { followers: user } });
        await currentUser.updateOne({ $pull: { followings: friend } });
        return { message: `User: ${friend} unfollowed` };
      } catch (err) {
        return err;
      }
    } else {
      return { message: "You can't unfollow yourself" };
    }
  }
  async registerUser(
    username: string,
    age: number,
    email: string,
    password: string,
  ) {
    const userInDb = await this.UserModel.findOne({
      username: username,
      email: email,
    }).exec();
    if (userInDb) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    password = await this.encryptPassword(password);
    const newUser = new this.UserModel({
      username,
      age,
      email,
      password,
    });
    try {
      const user = await newUser.save();
      const token = await this.auth.generateJwt(user);
      const result = {
        id: user.id,
        username: user.username,
        email: user.email,
        followers: user.followers,
        followings: user.followings,
        accessToken: token,
      };
      return result;
    } catch (err) {
      return err;
    }
  }
  async signIn(email: string, password: string) {
    const user = await this.UserModel.findOne({ email: email }).exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const result = await this.matchPassword(password, user.password);
    if (result === true) {
      const token = await this.auth.generateJwt(user);
      return { userId: user._id, username: user.username, accessToken: token };
    } else {
      return { message: 'error logging in' };
    }
  }
  async removeUser(username: string) {
    return await this.UserModel.deleteOne({ username: username });
  }
  async getUsers(n: string, pagesize: string) {
    const n1 = parseInt(n);
    const pagesize1 = parseInt(pagesize);
    if (n1 <= 0 || pagesize1 <= 0) {
      throw new HttpException(
        'offset or limit not valid',
        HttpStatus.BAD_REQUEST,
      );
    }
    const result = await this.UserModel.find()
      .populate('followings followers', 'username')
      .skip(pagesize1 * (n1 - 1))
      .limit(pagesize1)
      .sort({ username: 1 })
      .select('-password');
    const count = result.length;
    const page = n + '/' + Math.ceil(count / pagesize1 + 1);
    const object = {
      users: result,
      pageNo: page,
    };
    return object;
    return await this.UserModel.find().select('-password');
  }
  async getFollowing(id: string) {
    const user = await this.UserModel.findOne({ _id: id });
    return user.followings;
  }
  async validateTokenUser(username: string) {
    const userToValidate = await this.UserModel.findOne({ username }).select(
      '-password',
    );
    if (userToValidate) {
      return userToValidate;
    } else {
      return null;
    }
  }

  private async matchPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
  private async encryptPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    console.log(hash);
    return hash;
  }
}
