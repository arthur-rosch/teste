import { UserRepository } from "../../../repository/prisma";
import { AnnotationRepository } from "../../../repository/prisma/prisma-annotation-repository";
import { GetByUserIdUseCase } from "../../../use-cases/cases/annotation/get-by-user-id";
import { PrismaClient } from "@prisma/client";

export function makeGetByUserIdAnnotation() {
  const prisma = new PrismaClient();
  const annotationRepository = new AnnotationRepository(prisma);
  const userRepository = new UserRepository(prisma);

  return new GetByUserIdUseCase(annotationRepository, userRepository);
}
