import { PrismaClient } from "@prisma/client";
import { UserRepository, RoomRepository } from "../../../repository/prisma";
import { AddUserToRoomUseCase } from "../../../use-cases/cases/room/add-user-to-chat-room";
import { NotificationRepository } from "../../../repository/prisma/prisma-notification-repository";
import { SendNotification } from "../../../service/sendNotification";

export function makeAddUserToRoomUseCase() {
  const prisma = new PrismaClient();

  const notificationRepository = new NotificationRepository(prisma);
  const notificationService = new SendNotification();
  const roomRepository = new RoomRepository(prisma);
  const userRepository = new UserRepository(prisma);

  return new AddUserToRoomUseCase(
    notificationRepository,
    notificationService,
    roomRepository,
    userRepository
  );
}
