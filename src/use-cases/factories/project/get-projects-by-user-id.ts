import { UserRepository } from "@/repository/prisma";
import { ProjectRepository } from "@/repository/prisma/prisma-project-repository";
import { GetProjectsByUserIdUseCase } from "@/use-cases/cases/project/get-projects-by-user-id";
import { PrismaClient } from "@prisma/client";

export function makeGetProjectsByUserIdUseCase() {
  const prisma = new PrismaClient();

  const projectRepository = new ProjectRepository(prisma);
  const userRepository = new UserRepository(prisma);
  const getProjectsByUserIdUseCase = new GetProjectsByUserIdUseCase(
    projectRepository,
    userRepository
  );

  return getProjectsByUserIdUseCase;
}
