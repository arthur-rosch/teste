import { ErrorHandler } from "@/http/middleware/errorResponse";
import { INotificationRepository, IUserRepository } from "@/repository";
import { Notification } from "@prisma/client";

interface UpdateReadyNotificationReq {
  notificationId: string;
  userId: string;
  ready: boolean;
}

export class UpdateReadyNotification {
  constructor(
    private userRepository: IUserRepository,
    private notificationRepository: INotificationRepository
  ) {}

  async execute(data: UpdateReadyNotificationReq) {
    const userAlreadyExists = await this.userRepository.getUserById(
      data.userId
    );

    if (!userAlreadyExists) {
      throw new ErrorHandler(400, "User Not Exists, try again");
    }

    await this.notificationRepository.updateReadyNotification(
      data.notificationId,
      data.ready
    );
  }
}
