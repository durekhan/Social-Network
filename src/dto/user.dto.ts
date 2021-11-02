import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ type: String, description: 'username' })
  username: string;

  @IsInt()
  @ApiProperty({ type: Number, description: 'age' })
  age: number;

  @IsString()
  @IsEmail()
  @ApiProperty({ type: String, description: 'email' })
  email: string;

  @IsString()
  @ApiProperty({ type: String, description: 'password' })
  password: string;

  @IsOptional()
  @IsString()
  followers: string[];

  @IsOptional()
  @IsString()
  followings: string[];

  @IsOptional()
  @IsString()
  stripeCustomerId: string;
}
