import { Board } from 'src/boards/entities/board.entity';
import {
  BaseEntity,
  Column as TableColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Column extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @TableColumn()
  name: string;

  @ManyToOne(() => Board, (board) => board.columns, {
    onDelete: 'CASCADE',
  })
  board: Board;
}
