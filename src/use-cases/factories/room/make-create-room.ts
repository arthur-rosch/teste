import { PrismaClient } from "@prisma/client";
import { CreateRoomUseCase } from "@/use-cases/cases/room/create";
import { UserRepository, RoomRepository } from "@/repository/prisma";
import { ChatRepository } from "@/repository/prisma/prisma-chat-repository";
import { NotificationRepository } from "@/repository/prisma/prisma-notification-repository";
import { SendNotification } from "@/service/sendNotification";

export function makeCreateRoomUseCase() {
  const prisma = new PrismaClient();

  const notificationRepository = new NotificationRepository(prisma);
  const notificationService = new SendNotification();
  const roomRepository = new RoomRepository(prisma);
  const userRepository = new UserRepository(prisma);
  const chatRepository = new ChatRepository(prisma);

  return new CreateRoomUseCase(notificationRepository, notificationService,roomRepository, userRepository, chatRepository);
}
