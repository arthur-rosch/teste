import { PrismaClient } from "@prisma/client";
import { UpdateRoomUseCase } from "../../../use-cases/cases/room/update";
import { RoomRepository, UserRepository } from "../../../repository/prisma";

export function makeUpdateRoomUseCase() {
  const prisma = new PrismaClient();
  const userRepository = new UserRepository(prisma);
  const roomRepository = new RoomRepository(prisma);

  return new UpdateRoomUseCase(roomRepository, userRepository);
}
