import { PrismaClient } from "@prisma/client";
import { RoomRepository } from "@/repository/prisma";
import { GetRoomByIdUseCase } from "@/use-cases/cases/room/get-by-id";

export function makeGetRoomByIdUseCase() {
  const prisma = new PrismaClient();
  const roomRepository = new RoomRepository(prisma);

  return new GetRoomByIdUseCase(roomRepository);
}
