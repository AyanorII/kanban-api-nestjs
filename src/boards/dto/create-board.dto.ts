import { IsArray, IsNotEmpty, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { CreateColumnDto } from 'src/columns/dto/create-column.dto';

export class CreateBoardDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsArray()
  columns: CreateColumnDto[];
}
