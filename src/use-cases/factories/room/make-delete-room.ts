import { PrismaClient } from "@prisma/client";
import { DeleteRoomUseCase } from "../../../use-cases/cases/room/delete";
import { RoomRepository, UserRepository } from "../../../repository/prisma";
import { ChatRepository } from "../../../repository/prisma/prisma-chat-repository";
import { NotificationRepository } from "../../../repository/prisma/prisma-notification-repository";
import { SendNotification } from "../../../service/sendNotification";

export function makeDeleteRoomUseCase() {
  const prisma = new PrismaClient();

  const notificationRepository = new NotificationRepository(prisma);
  const notificationService = new SendNotification();
  const userRepository = new UserRepository(prisma);
  const roomRepository = new RoomRepository(prisma);
  const chatRepository = new ChatRepository(prisma);

  return new DeleteRoomUseCase(notificationRepository, notificationService, chatRepository, roomRepository, userRepository);
}
