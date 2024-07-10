import { Annotation } from "@prisma/client";
import { IAnnotationRepository, INotificationRepository, IUserRepository } from "../../../repository";
import { ErrorHandler } from "../../../http/middleware/errorResponse";
import { SendNotification } from "../../../service/sendNotification";

interface CreateAnnotationUseCaseReq {
  information: string;
  title: string;
  color: string;
  userId: string;
}

export class CreateAnnotationUseCase {
  constructor(
    private notificationRepository: INotificationRepository,
    private notificationService: SendNotification,
    private annotationRepository: IAnnotationRepository,
    private userRepository: IUserRepository
  ) {}

  async execute({
    color,
    information,
    title,
    userId,
  }: CreateAnnotationUseCaseReq): Promise<Annotation> {
    const user = await this.userRepository.getUserById(userId);

    if (!user) {
      throw new ErrorHandler(400, "User not found, try again");
    }

    const annotation = await this.annotationRepository.create({
      color,
      information,
      title,
      userId,
    });

    const notificationParams = {
      userId,
      senderId: userId,
      message: `Você acabou de criar uma anotação`,
    };

    const notification =
      await this.notificationRepository.create(notificationParams);

    await this.notificationService.send(notification);

    return annotation;
  }
}
