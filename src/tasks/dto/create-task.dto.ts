import { IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateSubtaskDto } from 'src/subtasks/dto/create-subtask.dto';

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  columnId: number;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  subtasks?: CreateSubtaskDto[];
}
