import { AnnotationRepository } from "@/repository/prisma/prisma-annotation-repository";
import { GetByIdUseCase } from "@/use-cases/cases/annotation/get-by-id";
import { PrismaClient } from "@prisma/client";

export function makeGetByIdAnnotation() {
  const prisma = new PrismaClient();
  const annotationRepository = new AnnotationRepository(prisma);

  return new GetByIdUseCase(annotationRepository);
}
