import { UserRepository } from "@/repository/prisma";
import { TaskRepository } from "@/repository/prisma/prisma-task-repository";
import { DeleteTaskUseCase } from "@/use-cases/cases/task/delete";
import { PrismaClient } from "@prisma/client";

export function makeDeleteTask() {
  const prisma = new PrismaClient();

  const taskRepository = new TaskRepository();
  const userRepository = new UserRepository(prisma);
  const deleteTask = new DeleteTaskUseCase(taskRepository, userRepository);

  return deleteTask;
}
