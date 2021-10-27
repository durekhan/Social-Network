import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class Auth {
  constructor(private jwtService: JwtService) {}
  async getJwtToken(uid: string) {
    const jwt = await this.jwtService.signAsync({ id: uid });
    return jwt;
  }
}
