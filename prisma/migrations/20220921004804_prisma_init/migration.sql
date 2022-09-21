-- CreateTable
CREATE TABLE "Board" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "PK_865a0f2e22c140d261b1df80eb1" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Column" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "color" VARCHAR NOT NULL,
    "boardId" INTEGER,

    CONSTRAINT "PK_cee3c7ee3135537fb8f5df4422b" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subtask" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "taskId" INTEGER,

    CONSTRAINT "PK_e0cda44ad38dba885bd8ab1afd3" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "status" VARCHAR NOT NULL,
    "columnId" INTEGER,

    CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Column" ADD CONSTRAINT "FK_cf15a522eb00160987b6fcf91e4" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Subtask" ADD CONSTRAINT "FK_8209040ec2c518c62c70cd382dd" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "FK_f56fe6f2d8ab0b970f764bd601b" FOREIGN KEY ("columnId") REFERENCES "Column"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
