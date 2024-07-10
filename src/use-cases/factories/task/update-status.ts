import { UserRepository } from "@/repository/prisma";
import { TaskRepository } from "@/repository/prisma/prisma-task-repository";
import { UpdateTaskStatusUseCase } from "@/use-cases/cases/task/update-status";
import { PrismaClient } from "@prisma/client";

export function makeUpdateTaskStatus() {
  const prisma = new PrismaClient();

  const taskRepository = new TaskRepository();
  const userRepository = new UserRepository(prisma);
  const createTask = new UpdateTaskStatusUseCase(
    taskRepository,
    userRepository
  );

  return createTask;
}
