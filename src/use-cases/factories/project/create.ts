import { UserRepository } from "../../../repository/prisma";
import { NotificationRepository } from "../../../repository/prisma/prisma-notification-repository";
import { ProjectRepository } from "../../../repository/prisma/prisma-project-repository";
import { SendNotification } from "../../../service/sendNotification";
import { CreateProjectUseCase } from "../../../use-cases/cases/project/create";
import { PrismaClient } from "@prisma/client";

export function makeCreateProject() {
  const prisma = new PrismaClient();

  const notificationRepository = new NotificationRepository(prisma);
  const notificationService = new SendNotification();
  const projectRepository = new ProjectRepository(prisma);
  const userRepository = new UserRepository(prisma);
  const createProject = new CreateProjectUseCase(
    notificationRepository,
    notificationService,
    projectRepository,
    userRepository
  );

  return createProject;
}
