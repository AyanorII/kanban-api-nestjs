import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as data from './data.json';
import { BoardsService } from '../boards/boards.service';
import { ColumnsService } from '../columns/columns.service';
import { SubtasksService } from '../subtasks/subtasks.service';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class SeedService {
  constructor(
    private boardsService: BoardsService,
    private columnsService: ColumnsService,
    private tasksService: TasksService,
    private subtasksService: SubtasksService,
  ) {}
  async seed(user: User) {
    const { boards } = data;

    boards.forEach(async (board) => {
      const { name, columns } = board;
      const createdBoard = await this.boardsService.create(
        { name, columns: [] },
        user,
      );

      columns.forEach(async (column) => {
        const { name, tasks } = column;
        const createdColumn = await this.columnsService.create(
          { name, boardId: createdBoard.id },
          user,
        );

        tasks.forEach(async (task) => {
          const { title, subtasks, description, status } = task;
          const createdTask = await this.tasksService.create(
            {
              title,
              description,
              status,
              columnId: createdColumn.id,
              subtasks: [],
            },
            user,
          );

          subtasks.forEach(async (subtask) => {
            const { title, isCompleted: completed } = subtask;
            await this.subtasksService.create(
              { title, completed, taskId: createdTask.id },
              user,
            );
          });
        });
      });
    });
  }
}
