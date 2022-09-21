import { PrismaClient } from '@prisma/client';
import * as data from './data.json';

const prisma = new PrismaClient();

const generateRandomHexColor = (): string => {
  const hex = Math.floor(Math.random() * 16777215).toString(16);
  return '#' + ('000000' + hex).slice(-6);
};

const drop = async () => {
  await prisma.board.deleteMany();
};

const seed = async () => {
  const { boards } = data;

  console.log('Seeding boards...');
  boards.forEach(async (board) => {
    const createdBoard = await prisma.board.create({
      data: {
        name: board.name,
      },
    });
    console.log(`Created board: '${createdBoard.name}'.`);

    const { columns } = board;

    console.log('Creating columns...');
    columns.forEach(async (column) => {
      const color = generateRandomHexColor();

      const createdColumn = await prisma.column.create({
        data: { name: column.name, color, boardId: createdBoard.id },
      });
      console.log(`Created column: '${createdColumn.name}'.`);

      const { tasks } = column;
      console.log('Creating tasks...');
      tasks.forEach(async ({ title, description, status, ...task }) => {
        const createdTask = await prisma.task.create({
          data: { title, description, status, columnId: createdColumn.id },
        });
        console.log(`Created task: '${createdTask.title}'.`);

        const { subtasks } = task;
        console.log('Creating subtasks...');
        subtasks.forEach(async ({ title, isCompleted, ...subtask }) => {
          const createdSubtask = await prisma.subtask.create({
            data: { title, completed: isCompleted, taskId: createdTask.id },
          });
          console.log(`Created subtask: '${createdSubtask.title}'.`);
        });
      });
    });
  });
};

const main = async () => {
  console.log('Dropping database...');
  await drop();
  console.log('Dropped database...');

  console.log('Seeding database...');
  await seed();
  console.log('Finished seeding the database.');
};

main();
