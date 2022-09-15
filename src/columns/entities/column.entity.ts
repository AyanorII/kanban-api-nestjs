import { Board } from 'src/boards/entities/board.entity';
import { Task } from 'src/tasks/entities/task.entity';
import {
  BaseEntity,
  Column as TableColumn,
  Entity,
  ManyToOne,
  OneToMany,
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

  @OneToMany(() => Task, (task) => task.column, {
    onDelete: 'CASCADE',
  })
  tasks: Task[];
}
