import { PartialType, PickType } from '@nestjs/swagger';
import { UpdateTaskDto } from './update-task.dto';

export class UpdateTaskStatusColumnDto extends PartialType(
  PickType(UpdateTaskDto, ['status', 'columnId'] as const),
) {}
