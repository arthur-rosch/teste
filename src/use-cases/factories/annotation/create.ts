import { UserRepository } from "@/repository/prisma";
import { AnnotationRepository } from "@/repository/prisma/prisma-annotation-repository";
import { NotificationRepository } from "@/repository/prisma/prisma-notification-repository";
import { SendNotification } from "@/service/sendNotification";
import { CreateAnnotationUseCase } from "@/use-cases/cases/annotation/create";
import { PrismaClient } from "@prisma/client";

export function makeCreateAnnotation() {
  const prisma = new PrismaClient();

  const notificationRepository = new NotificationRepository(prisma);
  const notificationService = new SendNotification();
  const annotationRepository = new AnnotationRepository(prisma);
  const userRepository = new UserRepository(prisma);

  return new CreateAnnotationUseCase(notificationRepository, notificationService,annotationRepository, userRepository);
}
