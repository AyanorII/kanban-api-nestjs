import { PickType } from '@nestjs/swagger';
import { CreateSubtaskDto } from './create-subtask.dto';

export class UpdateSubtaskCompletedDto extends PickType(CreateSubtaskDto, [
  'completed',
] as const) {}
