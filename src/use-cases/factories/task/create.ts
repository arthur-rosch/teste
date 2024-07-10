import { UserRepository } from "@/repository/prisma";
import { NotificationRepository } from "@/repository/prisma/prisma-notification-repository";
import { ProjectRepository } from "@/repository/prisma/prisma-project-repository";
import { TaskRepository } from "@/repository/prisma/prisma-task-repository";
import { SendNotification } from "@/service/sendNotification";
import { CreateTaskUseCase } from "@/use-cases/cases/task/create";
import { PrismaClient } from "@prisma/client";

export function makeCreateTask() {
  const prisma = new PrismaClient();

  const notificationRepository = new NotificationRepository(prisma);
  const notificationService = new SendNotification();
  const taskRepository = new TaskRepository();
  const projectRepository = new ProjectRepository(prisma);
  const userRepository = new UserRepository(prisma);
  const createTask = new CreateTaskUseCase(
    notificationRepository,
    notificationService,
    taskRepository,
    projectRepository,
    userRepository
  );

  return createTask;
}
