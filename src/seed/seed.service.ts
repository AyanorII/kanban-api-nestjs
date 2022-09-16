import { Injectable } from '@nestjs/common';
import { BoardsService } from '../boards/boards.service';
import { Board } from '../boards/entities/board.entity';
import { ColumnsService } from '../columns/columns.service';
import { Column } from '../columns/entities/column.entity';
import * as data from '../data.json';
import { Subtask } from '../subtasks/entities/subtask.entity';
import { SubtasksService } from '../subtasks/subtasks.service';
import { Task } from '../tasks/entities/task.entity';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class SeedService {
  constructor(
    private boardsService: BoardsService,
    private columnsService: ColumnsService,
    private tasksService: TasksService,
    private subtasksService: SubtasksService,
  ) {}

  async seed(): Promise<void> {
    await this.drop();

    const { boards } = data;

    console.log('Seeding boards...');
    boards.forEach(async (board) => {
      const createdBoard = await this.boardsService.create({
        name: board.name,
      });
      console.log(`Created board '${board.name}'`);

      const { columns } = board;

      console.log('Seeding columns...');
      columns.forEach(async (column) => {
        const createdColumn = await this.columnsService.create({
          name: column.name,
          boardId: createdBoard.id,
        });
        console.log(`Created column '${column.name}'`);

        const { tasks } = column;

        console.log('Seeding tasks...');
        tasks.forEach(async (task) => {
          const createdTask = await this.tasksService.create({
            title: task.title,
            description: task.description,
            status: task.status,
            columnId: createdColumn.id,
          });
          console.log(`Created task '${task.title}'`);

          const { subtasks } = task;

          console.log('Seeding subtasks...');

          subtasks.forEach(async (subtask) => {
            await this.subtasksService.create({
              title: subtask.title,
              completed: subtask.isCompleted,
              taskId: createdTask.id,
            });

            console.log(`Created subtask '${subtask.title}'`);
          });
        });
      });
    });

    console.log('Finished seeding database :)');
  }

  async drop(): Promise<void> {
    console.log('Droping database');

    console.log('Deleting boards...');
    await this.deleteBoards();

    console.log('Deleting columns...');
    await this.deleteColumns();

    console.log('Deleting tasks...');
    await this.deleteTasks();

    console.log('Deleting subtasks...');
    await this.deleteSubtasks();

    console.log('');
    console.log('');
  }

  /* -------------------------------- Private ------------------------------- */
  private async deleteBoards(): Promise<void> {
    const query = Board.createQueryBuilder('board');
    const result = await query.delete().execute();
    console.log(`Deleted ${result.affected} rows`);
  }

  private async deleteColumns(): Promise<void> {
    const query = Column.createQueryBuilder('column');
    const result = await query.delete().execute();
    console.log(`Deleted ${result.affected} rows`);
  }

  private async deleteTasks(): Promise<void> {
    const query = Task.createQueryBuilder('task');
    const result = await query.delete().execute();
    console.log(`Deleted ${result.affected} rows`);
  }

  private async deleteSubtasks(): Promise<void> {
    const query = Subtask.createQueryBuilder('subtask');
    const result = await query.delete().execute();
    console.log(`Deleted ${result.affected} rows`);
  }
}
