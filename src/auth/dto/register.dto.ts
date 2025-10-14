import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'johndoe', description: 'Unique username' })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Password (min 6 characters)' })
  @IsString()
  @MinLength(6)
  password: string;
}
