import { Room } from "@prisma/client";
import { IRoomRepository } from "@/repository";
import { ErrorHandler } from "@/http/middleware/errorResponse";

export class GetRoomByIdUseCase {
  constructor(private roomRepository: IRoomRepository) {}

  async execute(roomId: string): Promise<Room | null> {
    const room = await this.roomRepository.getById(roomId);

    if (!room) {
      throw new ErrorHandler(400, "Room Not Found, try again");
    }

    return room;
  }
}
