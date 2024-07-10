import { Prisma } from "@prisma/client";
import { ErrorHandler } from "@/http/middleware/errorResponse";
import { IRoomRepository, IUserRepository } from "@/repository";

export class UpdateRoomUseCase {
  constructor(
    private roomRepository: IRoomRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(name: string, roomId: string, userId: string): Promise<void> {
    const owner = await this.userRepository.getUserById(userId);

    if (!owner) {
      throw new ErrorHandler(400, "User Not Found, try again");
    }

    const existingRoom = await this.roomRepository.getById(roomId);

    if (!existingRoom) {
      throw new ErrorHandler(400, "Room Not Found, try again");
    }

    if (existingRoom.ownerId !== owner.id) {
      throw new ErrorHandler(
        400,
        "Unauthorized, Only owner can update the Room"
      );
    }

    await this.roomRepository.update(name, roomId);
  }
}
