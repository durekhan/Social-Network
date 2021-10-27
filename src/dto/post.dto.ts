import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @ApiProperty({ type: String, description: 'post content' })
  content: string;
}
