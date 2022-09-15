import { PartialType, PickType } from '@nestjs/swagger';
import { UpdateTaskDto } from './update-task.dto';

export class UpdateTaskStatusColumn extends PartialType(
  PickType(UpdateTaskDto, ['status', 'columnId'] as const),
) {}
