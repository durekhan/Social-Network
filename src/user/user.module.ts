import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { Auth } from 'src/config/auth';
import { PostModule } from 'src/post/post.module';
import { PostService } from 'src/post/post.service';
import StripeService from 'src/stripe/stripe.service';
import { UserController } from './user.controller';
import { UserSchema } from './user.model';
import { UserService } from './user.service';

@Module({
  imports: [
    PostModule,
    PassportModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    ConfigModule.forRoot(),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService, StripeService],
  exports: [UserService],
})
export class UserModule {}
