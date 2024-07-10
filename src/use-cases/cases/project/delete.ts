import { ErrorHandler } from '../../../http/middleware/errorResponse'
import {
  INotificationRepository,
  IProjectRepository,
  IUserRepository,
} from '../../../repository'
import { SendNotification } from '../../../service/sendNotification'

export class DeleteProjectUseCase {
  constructor(
    private notificationRepository: INotificationRepository,
    private notificationService: SendNotification,
    private projectRepository: IProjectRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute(projectId: string, ownerId: string): Promise<void> {
    const owner = await this.userRepository.getUserById(ownerId)

    if (!owner) {
      throw new ErrorHandler(400, 'User not found, try again')
    }

    const projectExists =
      await this.projectRepository.findProjectById(projectId)

    if (!projectExists) {
      throw new Error('Project does not exist')
    }

    if (projectExists.ownerId !== ownerId) {
      throw new ErrorHandler(
        400,
        'Unauthorized, Only owner can delete the Project',
      )
    }

    const notificationParams = {
      userId: ownerId,
      senderId: ownerId,
      message: `Você acabou de deletar o projeto ${projectExists.name}`,
    }

    const notification =
      await this.notificationRepository.create(notificationParams)

    await this.notificationService.send(notification)

    await this.projectRepository.delete(projectId)
  }
}
