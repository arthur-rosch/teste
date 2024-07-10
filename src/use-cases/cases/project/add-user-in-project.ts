import { ErrorHandler } from '@/http/middleware/errorResponse'
import {
  INotificationRepository,
  IProjectRepository,
  IUserRepository,
} from '@/repository'
import { SendNotification } from '@/service/sendNotification'

interface AddUserInProjectUseCaseRequest {
  projectId: string
  userId: string
  ownerId: string
}

interface AddUserInProjectUseCaseResponse {
  message: string
}

export class AddUserInProjectUseCase {
  constructor(
    private notificationRepository: INotificationRepository,
    private notificationService: SendNotification,
    private projectRepository: IProjectRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute({
    ownerId,
    projectId,
    userId,
  }: AddUserInProjectUseCaseRequest): Promise<AddUserInProjectUseCaseResponse> {
    const owner = await this.userRepository.getUserById(ownerId)

    if (!owner) {
      throw new ErrorHandler(400, 'Owner not found, try again')
    }

    const user = await this.userRepository.getUserById(userId)

    if (!user) {
      throw new ErrorHandler(400, 'Add User not found, try again')
    }

    const project = await this.projectRepository.findProjectById(projectId)

    if (!project) {
      throw new ErrorHandler(400, 'Project not found, try again')
    }

    const userInProject = await this.projectRepository.isUserInProject(
      projectId,
      userId,
    )

    if (userInProject) {
      return { message: 'User is already in the project' }
    }

    await this.projectRepository.addUserInProject(projectId, userId)

    const notificationParams = {
      userId,
      senderId: ownerId,
      message: `Você foi convidado para o projeto ${project.name}`,
    }

    const notification =
      await this.notificationRepository.create(notificationParams)

    await this.notificationService.send(notification)

    return { message: 'User added successfully' }
  }
}
