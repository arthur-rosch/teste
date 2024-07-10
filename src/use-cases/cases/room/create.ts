import { Prisma, Room } from "@prisma/client";
import { IChatRepository } from "../../../repository/chat";
import { ErrorHandler } from "../../../http/middleware/errorResponse";
import { IUserRepository, IRoomRepository, INotificationRepository } from "../../../repository";
import { SendNotification } from "../../../service/sendNotification";

export class CreateRoomUseCase {
  constructor(
    private notificationRepository: INotificationRepository,
    private notificationService: SendNotification,
    private roomRepository: IRoomRepository,
    private userRepository: IUserRepository,
    private chatRepository: IChatRepository
  ) {}

  async execute(data: Prisma.RoomUncheckedCreateInput): Promise<Room> {
    const owner = await this.userRepository.getUserById(data.ownerId);

    if (!owner) {
      throw new ErrorHandler(400, "User Not Found, try again");
    }

    const createdRoom = await this.roomRepository.create(data);

    await this.chatRepository.create({
      roomId: createdRoom.id,
    });

    const notificationParams = {
      userId: owner.id,
      senderId: owner.id,
      message: `Você acabou de criar a sala ${data.name}`,
    };

    const notification =
      await this.notificationRepository.create(notificationParams);

    await this.notificationService.send(notification);

    return createdRoom;
  }
}
