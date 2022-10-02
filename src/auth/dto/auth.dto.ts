import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

@Injectable()
export class AuthDto {
  @ApiProperty()
  @IsEmail({ unique: true })
  email: string;

  @ApiProperty()
  password: string;
}
