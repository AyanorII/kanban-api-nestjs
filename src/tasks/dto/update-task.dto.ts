import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { UpdateSubtaskDto } from '../../subtasks/dto/update-subtask.dto';
import { CreateTaskDto } from './create-task.dto';

interface Id {
  id: number;
}

export class UpdateTaskDto extends PartialType(
  OmitType(CreateTaskDto, ['subtasks'] as const),
) {
  @ApiProperty()
  subtasks?: (UpdateSubtaskDto & Id)[];
}
