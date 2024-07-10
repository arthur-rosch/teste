import { UserRepository } from "../../../repository/prisma";
import { ProjectRepository } from "../../../repository/prisma/prisma-project-repository";
import { UpdateStatusPrivacyProjectUseCase } from "../../../use-cases/cases/project/update-status-privacy";
import { PrismaClient } from "@prisma/client";

export function makeUpdateStatusPrivacyProjectUseCase() {
  const prisma = new PrismaClient();

  const projectRepository = new ProjectRepository(prisma);
  const userRepository = new UserRepository(prisma);
  const updateStatusPrivacyProjectUseCase =
    new UpdateStatusPrivacyProjectUseCase(projectRepository, userRepository);

  return updateStatusPrivacyProjectUseCase;
}
