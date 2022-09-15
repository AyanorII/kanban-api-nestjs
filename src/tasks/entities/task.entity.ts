import { Column } from 'src/columns/entities/column.entity';
import {
  BaseEntity,
  Column as TableColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @TableColumn()
  title: string;

  @TableColumn()
  description: string;

  @TableColumn()
  status: string;

  @ManyToOne(() => Column, (column) => column.tasks, {
    onDelete: 'CASCADE',
    eager: true,
  })
  column: Column;
}
