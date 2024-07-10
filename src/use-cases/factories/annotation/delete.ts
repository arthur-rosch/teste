import { UserRepository } from "@/repository/prisma";
import { AnnotationRepository } from "@/repository/prisma/prisma-annotation-repository";
import { NotificationRepository } from "@/repository/prisma/prisma-notification-repository";
import { SendNotification } from "@/service/sendNotification";
import { DeleteAnnotationUseCase } from "@/use-cases/cases/annotation/delete";
import { PrismaClient } from "@prisma/client";

export function makeDeleteAnnotation() {
  const prisma = new PrismaClient();

  const notificationRepository = new NotificationRepository(prisma);
  const notificationService = new SendNotification();
  const annotationRepository = new AnnotationRepository(prisma);
  const userRepository = new UserRepository(prisma);

  return new DeleteAnnotationUseCase(notificationRepository, notificationService,annotationRepository, userRepository);
}
