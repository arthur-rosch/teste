import { ErrorHandler } from "../../../http/middleware/errorResponse";
import {
  INotificationRepository,
  IProjectRepository,
  IUserRepository,
} from "../../../repository";
import { SendNotification } from "../../../service/sendNotification";

interface RemoveUserInProjectUseCaseRequest {
  projectId: string;
  userId: string;
  ownerId: string;
}

interface RemoveUserInProjectUseCaseResponse {
  message: string;
}

export class RemoveUserInProjectUseCase {
  constructor(
    private notificationRepository: INotificationRepository,
    private notificationService: SendNotification,
    private projectRepository: IProjectRepository,
    private userRepository: IUserRepository
  ) {}

  async execute({
    ownerId,
    projectId,
    userId,
  }: RemoveUserInProjectUseCaseRequest): Promise<RemoveUserInProjectUseCaseResponse> {
    const owner = await this.userRepository.getUserById(ownerId);

    if (!owner) {
      throw new ErrorHandler(400, "Owner not found, try again");
    }

    const user = await this.userRepository.getUserById(userId);

    if (!user) {
      throw new ErrorHandler(400, "Add User not found, try again");
    }

    const project = await this.projectRepository.findProjectById(projectId);

    if (!project) {
      throw new ErrorHandler(400, "Project not found, try again");
    }

    const userInProject = await this.projectRepository.isUserInProject(
      projectId,
      userId
    );

    if (!userInProject) {
      return { message: "Not User is already in the project" };
    }

    await this.projectRepository.removeUserInProject(projectId, userId);

    const notificationParams = {
      userId,
      senderId: ownerId,
      message: `Você foi removido do projeto ${project.name}`,
    };

    const notification = await this.notificationRepository.create(notificationParams);

    await this.notificationService.send(notification);

    return { message: "User removed successfully" };
  }
}
