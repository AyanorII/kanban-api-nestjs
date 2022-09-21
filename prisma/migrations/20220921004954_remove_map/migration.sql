-- AlterTable
ALTER TABLE "Board" RENAME CONSTRAINT "PK_865a0f2e22c140d261b1df80eb1" TO "Board_pkey";

-- AlterTable
ALTER TABLE "Column" RENAME CONSTRAINT "PK_cee3c7ee3135537fb8f5df4422b" TO "Column_pkey";

-- AlterTable
ALTER TABLE "Subtask" RENAME CONSTRAINT "PK_e0cda44ad38dba885bd8ab1afd3" TO "Subtask_pkey";

-- AlterTable
ALTER TABLE "Task" RENAME CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" TO "Task_pkey";

-- RenameForeignKey
ALTER TABLE "Column" RENAME CONSTRAINT "FK_cf15a522eb00160987b6fcf91e4" TO "Column_boardId_fkey";

-- RenameForeignKey
ALTER TABLE "Subtask" RENAME CONSTRAINT "FK_8209040ec2c518c62c70cd382dd" TO "Subtask_taskId_fkey";

-- RenameForeignKey
ALTER TABLE "Task" RENAME CONSTRAINT "FK_f56fe6f2d8ab0b970f764bd601b" TO "Task_columnId_fkey";
