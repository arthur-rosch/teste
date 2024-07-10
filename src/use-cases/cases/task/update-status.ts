import { ErrorHandler } from '../../../http/middleware/errorResponse'
import { ITaskRepository, IUserRepository } from '../../../repository'
import { Status, Task } from '@prisma/client'

export class UpdateTaskStatusUseCase {
  constructor(
    private taskRepository: ITaskRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute(taskId: string, status: Status, userId: string): Promise<Task> {
    const user = await this.userRepository.getUserById(userId)

    if (!user) {
      throw new ErrorHandler(400, 'User not found, try again')
    }

    const taskExists = await this.taskRepository.findById(taskId)

    if (!taskExists) {
      throw new ErrorHandler(400, 'Task not found, try again')
    }

    const updatedTask = await this.taskRepository.updateStatus(taskId, status)

    return updatedTask
  }
}
