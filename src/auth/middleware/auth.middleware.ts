import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from 'src/user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    //console.log('Request...');
    if (req.headers.authorization === undefined) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'No bearer token given',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    const token = req.headers.authorization.replace('Bearer ', '');
    //console.log(token);
    try {
      const result = await this.authService.validate(token); //get user
      const user = await this.userService.validateTokenUser(result.username);
      //console.log(user);
      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'Invalid User Token',
          },
          HttpStatus.FORBIDDEN,
        );
      } else {
        //console.log(user);
        req.user = user;
        next();
      }
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Invalid token',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
