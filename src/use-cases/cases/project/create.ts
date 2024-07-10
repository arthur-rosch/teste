import { Privacy, Projects } from "@prisma/client";
import { ErrorHandler } from "../../../http/middleware/errorResponse";
import { INotificationRepository, IProjectRepository, IUserRepository } from "../../../repository";
import { SendNotification } from "../../../service/sendNotification";

interface CreateProjectUseCaseReq {
  name: string;
  color: string;
  ownerId: string;
  privacy: Privacy;
  usersIds: string[];
}

export class CreateProjectUseCase {
  constructor(
    private notificationRepository: INotificationRepository,
    private notificationService: SendNotification,
    private projectRepository: IProjectRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(data: CreateProjectUseCaseReq): Promise<Projects> {
    const owner = await this.userRepository.getUserById(data.ownerId);

    if (!owner) {
      throw new ErrorHandler(400, "User not found, try again");
    }

    for (const element of data.usersIds) {
      const user = await this.userRepository.getUserById(element);

      if (!user) {
        throw new ErrorHandler(400, "Added user does not exist");
      }

      const notificationParams = {
        userId: element,
        senderId: data.ownerId,
        message: `${owner.name} convidou você para o projeto ${data.name}`,
      };

      const notification =
        await this.notificationRepository.create(notificationParams);

      await this.notificationService.send(notification);
    }

    const notificationParams = {
      userId: data.ownerId,
      senderId: data.ownerId,
      message: `Você acabou de criar o projeto ${data.name}`
    }

     const notification =
       await this.notificationRepository.create(notificationParams);

     await this.notificationService.send(notification);

    const newProject = await this.projectRepository.create(data);

    return newProject;
  }
}
