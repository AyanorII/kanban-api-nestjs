import { PartialType, PickType } from '@nestjs/swagger';
import { UpdateTaskDto } from './update-task.dto';

export class UpdateTaskTitleDescription extends PartialType(
  PickType(UpdateTaskDto, ['title', 'description'] as const),
) {}
