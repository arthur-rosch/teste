import { UserRepository } from "@/repository/prisma";
import { NotificationRepository } from "@/repository/prisma/prisma-notification-repository";
import { ProjectRepository } from "@/repository/prisma/prisma-project-repository";
import { SendNotification } from "@/service/sendNotification";
import { DeleteProjectUseCase } from "@/use-cases/cases/project/delete";
import { PrismaClient } from "@prisma/client";

export function makeDeleteProject() {
  const prisma = new PrismaClient();

  const notificationRepository = new NotificationRepository(prisma);
  const notificationService = new SendNotification();
  const projectRepository = new ProjectRepository(prisma);
  const userRepository = new UserRepository(prisma);
  const deleteProject = new DeleteProjectUseCase(
    notificationRepository,
    notificationService,
    projectRepository,
    userRepository
  );

  return deleteProject;
}
