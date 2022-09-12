import {
  BaseEntity,
  Column as TableColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Column } from '../../columns/entities/column.entity';

@Entity()
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @TableColumn()
  name: string;

  @OneToMany(() => Column, (column) => column.board)
  columns: Column[];
}
