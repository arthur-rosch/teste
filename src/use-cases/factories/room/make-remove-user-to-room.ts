import { PrismaClient } from "@prisma/client";
import { UserRepository, RoomRepository } from "@/repository/prisma";
import { RemoveUserToRoomUseCase } from "@/use-cases/cases/room/remove-user-to-chat-room";
import { NotificationRepository } from "@/repository/prisma/prisma-notification-repository";
import { SendNotification } from "@/service/sendNotification";

export function makeRemoveUserToRoomUseCase() {
  const prisma = new PrismaClient();

  const notificationRepository = new NotificationRepository(prisma);
  const notificationService = new SendNotification();
  const userRepository = new UserRepository(prisma);
  const roomRepository = new RoomRepository(prisma);

  return new RemoveUserToRoomUseCase(
    notificationRepository,
    notificationService,
    roomRepository,
    userRepository
  );
}
