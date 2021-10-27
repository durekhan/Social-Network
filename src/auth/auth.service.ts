import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/dto/user.dto';
import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async generateJwt(payload: User) {
    const user = {
      username: payload.username,
      email: payload.email,
      age: payload.age,
    };
    const token = this.jwtService.sign({ user });
    return token;
  }
  async validate(payload: string) {
    const result = await this.jwtService.verifyAsync(payload);
    return result.user;
  }
}
