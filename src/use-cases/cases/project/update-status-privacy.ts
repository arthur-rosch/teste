import { Projects, Privacy } from '@prisma/client'
import { ErrorHandler } from '@/http/middleware/errorResponse'
import { IProjectRepository, IUserRepository } from '@/repository'

export class UpdateStatusPrivacyProjectUseCase {
  constructor(
    private projectRepository: IProjectRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute(
    projectId: string,
    ownerId: string,
    statusPrivacy: Privacy,
  ): Promise<Projects> {
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

    const updatedProject = await this.projectRepository.updateStatus(
      projectId,
      statusPrivacy,
    )

    return updatedProject
  }
}
