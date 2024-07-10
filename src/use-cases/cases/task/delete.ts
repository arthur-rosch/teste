import { ErrorHandler } from '@/http/middleware/errorResponse'
import { ITaskRepository, IUserRepository } from '@/repository'

export class DeleteTaskUseCase {
  constructor(
    private taskRepository: ITaskRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute(taskId: string, userId: string): Promise<{ message: string }> {
    const user = await this.userRepository.getUserById(userId)

    if (!user) {
      throw new ErrorHandler(400, 'User not found, try again')
    }

    const taskExists = await this.taskRepository.findById(taskId)

    if (!taskExists) {
      throw new ErrorHandler(400, 'Task not found, try again')
    }

    await this.taskRepository.delete(taskId)

    return { message: 'Task deleted successfully' }
  }
}
