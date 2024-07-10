import { Projects } from '@prisma/client'
import { ErrorHandler } from '../../../http/middleware/errorResponse'
import { IProjectRepository, IUserRepository } from '../../../repository'

export class GetProjectsByUserIdUseCase {
  constructor(
    private projectRepository: IProjectRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<Projects[]> {
    const user = await this.userRepository.getUserById(userId)

    if (!user) {
      throw new ErrorHandler(400, 'User not found, try again')
    }

    const projects = await this.projectRepository.findByUserId(userId)

    return projects
  }
}
