import { UserRepository } from "@/repository/prisma";
import { NotificationRepository } from "@/repository/prisma/prisma-notification-repository";
import { ProjectRepository } from "@/repository/prisma/prisma-project-repository";
import { SendNotification } from "@/service/sendNotification";
import { AddUserInProjectUseCase } from "@/use-cases/cases/project/add-user-in-project";
import { PrismaClient } from "@prisma/client";

export function makeAddUserInProjectUseCase() {
  const prisma = new PrismaClient();

  const notificationRepository = new NotificationRepository(prisma);
  const notificationService = new SendNotification();
  const projectRepository = new ProjectRepository(prisma);
  const userRepository = new UserRepository(prisma);
  const addUserInProjectUseCase = new AddUserInProjectUseCase(
    notificationRepository,
    notificationService,
    projectRepository,
    userRepository
  );

  return addUserInProjectUseCase;
}
