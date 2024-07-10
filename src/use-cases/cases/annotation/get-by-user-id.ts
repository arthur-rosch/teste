import { Annotation } from '@prisma/client'
import { IAnnotationRepository, IUserRepository } from '../../../repository'
import { ErrorHandler } from '../../../http/middleware/errorResponse'

interface GetByUserIdUseCaseReq {
  userId: string
}

export class GetByUserIdUseCase {
  constructor(
    private annotationRepository: IAnnotationRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute({ userId }: GetByUserIdUseCaseReq): Promise<Annotation[]> {
    const user = await this.userRepository.getUserById(userId)

    if (!user) {
      throw new ErrorHandler(400, 'User not found, try again')
    }

    const annotations = await this.annotationRepository.getByUserId(userId)

    return annotations
  }
}
