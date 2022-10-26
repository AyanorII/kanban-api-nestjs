import { IsOptional } from '@nestjs/class-validator';
import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';

@Injectable()
export class AuthDto {
  @ApiProperty()
  @IsEmail({ unique: true })
  email: string;

  @ApiProperty()
  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  photo?: string;
}
