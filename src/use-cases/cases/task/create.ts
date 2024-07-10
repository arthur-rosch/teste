import { Prisma, Task } from '@prisma/client'
import {
  IUserRepository,
  IProjectRepository,
  ITaskRepository,
  INotificationRepository,
} from '../../../repository'
import { ErrorHandler } from '../../../http/middleware/errorResponse'
import { SendNotification } from '../../../service/sendNotification';

export class CreateTaskUseCase {
  constructor(
    private notificationRepository: INotificationRepository,
    private notificationService: SendNotification,
    private taskRepository: ITaskRepository,
    private projectRepository: IProjectRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(data: Prisma.TaskUncheckedCreateInput): Promise<Task> {
    const projectExists = await this.projectRepository.findProjectById(
      data.projectId
    );
    if (!projectExists) {
      throw new ErrorHandler(400, "Project does not exist");
    }

    if (data.responsibleId) {
      const responsibleExists = await this.userRepository.getUserById(
        data.responsibleId
      );

      if (!responsibleExists) {
        throw new ErrorHandler(400, "Responsible not found, try again");
      }

      const isInProject = await this.projectRepository.isUserInProject(
        data.projectId,
        data.responsibleId
      );

      if (!isInProject) {
        throw new ErrorHandler(400, "Responsible user is not in the project");
      }
    }

    const notificationParams = {
      userId: data.responsibleId!,
      senderId: projectExists.ownerId,
      message: `Você foi adicionado a tarefa ${data.title}`,
    };

    const notification =
      await this.notificationRepository.create(notificationParams);

    await this.notificationService.send(notification);

    const newTask = await this.taskRepository.create(data);

    return newTask;
  }
}
