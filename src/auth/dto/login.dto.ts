import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'johndoe', description: 'Username' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'password123', description: 'Password' })
  @IsString()
  password: string;
}
