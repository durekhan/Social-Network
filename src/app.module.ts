import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { AuthMiddleware } from './auth/middleware/auth.middleware';
import { UserController } from './user/user.controller';
import { PostController } from './post/post.controller';
import { AppGateway } from './app.gateway';
import { EventEmitterModule } from '@nestjs/event-emitter';
@Module({
  imports: [
    PassportModule,
    PostModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URL),
    AuthModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: '/user/me', method: RequestMethod.GET },
      { path: '/user', method: RequestMethod.GET },
      { path: '/post', method: RequestMethod.POST },
      {
        path: '/user/feed',
        method: RequestMethod.GET,
      },
      { path: '/user/delete', method: RequestMethod.DELETE },
    );
  }
}
