import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateSubtaskDto } from './create-subtask.dto';

export class UpdateSubtaskDto extends PartialType(
  OmitType(CreateSubtaskDto, ['taskId'] as const),
) {}
