import { ErrorHandler } from "../../../http/middleware/errorResponse";
import { IUserRepository, IRoomRepository, INotificationRepository } from "../../../repository";
import { SendNotification } from "../../../service/sendNotification";

export class AddUserToRoomUseCase {
  constructor(
    private notificationRepository: INotificationRepository,
    private notificationService: SendNotification,
    private roomRepository: IRoomRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(
    roomId: string,
    userId: string,
    ownerId: string
  ): Promise<void> {
    const owner = await this.userRepository.getUserById(ownerId);

    if (!owner) {
      throw new ErrorHandler(400, "User Not Found, try again");
    }

    const existingRoom = await this.roomRepository.getById(roomId);

    if (!existingRoom) {
      throw new ErrorHandler(400, "Room Not Found, try again");
    }

    const userExists = await this.userRepository.getUserById(userId);

    if (!userExists) {
      throw new ErrorHandler(400, "User Not Found, try again");
    }

    if (owner.id !== existingRoom.ownerId) {
      throw new ErrorHandler(
        400,
        "Unauthorized, Only owner can added the Chat Room"
      );
    }
    await this.roomRepository.addUserToChat(roomId, userId);

    const notificationParams = {
      userId,
      senderId: ownerId,
      message: `Você foi adicionado a sala ${existingRoom.name}`,
    };

    const notification =
      await this.notificationRepository.create(notificationParams);

    await this.notificationService.send(notification);
  }
}
