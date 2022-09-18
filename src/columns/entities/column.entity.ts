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

  @TableColumn()
  color: string;

  @ManyToOne(() => Board, (board) => board.columns, {
    onDelete: 'CASCADE',
  })
  board: Board;

  @OneToMany(() => Task, (task) => task.column, {
    onDelete: 'CASCADE',
  })
  tasks: Task[];

  static generateRandomHexColor(): string {
    const hex = Math.floor(Math.random() * 16777215).toString(16);
    return '#' + ('000000' + hex).slice(-6);
  }
}
