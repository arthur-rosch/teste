import { RoomRepository, UserRepository } from "@/repository/prisma";
import { AddVideoRoomUseCase } from "@/use-cases/cases/room/add-video-room";
import { PrismaClient } from "@prisma/client";

export function makeAddVideoRoom() {
  const prisma = new PrismaClient();
  const roomRepository = new RoomRepository(prisma);
  const userRepository = new UserRepository(prisma);

  return new AddVideoRoomUseCase(roomRepository, userRepository);
}
