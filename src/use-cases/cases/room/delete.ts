import { ErrorHandler } from "../../../http/middleware/errorResponse";
import { INotificationRepository, IRoomRepository, IUserRepository } from "../../../repository";
import { IChatRepository } from "../../../repository/chat";
import { SendNotification } from "../../../service/sendNotification";
import { Chat } from "@prisma/client";

export class DeleteRoomUseCase {
  constructor(
    private notificationRepository: INotificationRepository,
    private notificationService: SendNotification,
    private chatRepository: IChatRepository,
    private roomRepository: IRoomRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(roomId: string, userId: string): Promise<void> {
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
        "Unauthorized, Only owner can delete the Room"
      );
    }

    const { id } = (await this.chatRepository.getByRoomId(roomId)) as Chat;

    const notificationParams = {
      userId: owner.id,
      senderId: owner.id,
      message: `Você acabou de deletar a sala ${existingRoom.name}`,
    };

    const notification =
      await this.notificationRepository.create(notificationParams);

    await this.notificationService.send(notification);

    await this.chatRepository.delete(id);

    await this.roomRepository.delete(roomId);
  }
}
