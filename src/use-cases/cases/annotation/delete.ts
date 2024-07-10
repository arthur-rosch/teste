import { Annotation } from '@prisma/client'
import { IAnnotationRepository, INotificationRepository, IUserRepository } from '@/repository'
import { ErrorHandler } from '@/http/middleware/errorResponse'
import { SendNotification } from '@/service/sendNotification'

interface DeleteAnnotationUseCaseReq {
  userId: string
  annotationId: string
}

export class DeleteAnnotationUseCase {
  constructor(
    private notificationRepository: INotificationRepository,
    private notificationService: SendNotification,
    private annotationRepository: IAnnotationRepository,
    private userRepository: IUserRepository
  ) {}

  async execute({
    userId,
    annotationId,
  }: DeleteAnnotationUseCaseReq): Promise<Annotation> {
    const user = await this.userRepository.getUserById(userId);

    if (!user) {
      throw new ErrorHandler(400, "User not found, try again");
    }

    const annotation = await this.annotationRepository.getById(annotationId);

    if (!annotation) {
      throw new ErrorHandler(400, "Annotation not found, try again");
    }

    if (annotation.userId !== user.id) {
      throw new ErrorHandler(
        400,
        "Unauthorized, Only owner can delete the Annotation"
      );
    }

    const deletedAnnotation =
      await this.annotationRepository.delete(annotationId);

    const notificationParams = {
      userId,
      senderId: userId,
      message: `Você acabou de deletar sua anotação`,
    };

    const notification =
      await this.notificationRepository.create(notificationParams);

    await this.notificationService.send(notification);

    return deletedAnnotation;
  }
}
