import { ErrorHandler } from "../../../http/middleware/errorResponse";
import { INotificationRepository, IUserRepository } from "../../../repository";
import { Notification } from "@prisma/client";

interface CreateNotificationRequest {
  userId: string;
  senderId: string;
  message: string;
}

export class CreateNotificationUseCase {
  constructor(
    private userRepository: IUserRepository,
    private notificationRepository: INotificationRepository
  ) {}

  async execute(data: CreateNotificationRequest) {
    const userAlreadyExists = await this.userRepository.getUserById(data.userId);

    if (!userAlreadyExists) {
      throw new ErrorHandler(400, "User Not Found, try again");
    }

    const senderAlreadyExists = await this.userRepository.getUserById(data.senderId);

    if (!senderAlreadyExists) {
      throw new ErrorHandler(400, "Send Not Found, try again");
    }

    await this.notificationRepository.create(data);
  }
}
