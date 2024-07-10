import { Annotation } from '@prisma/client'
import { IAnnotationRepository } from '@/repository'
import { ErrorHandler } from '@/http/middleware/errorResponse'

interface GetByIdUseCaseReq {
  annotationId: string
}

export class GetByIdUseCase {
  constructor(private annotationRepository: IAnnotationRepository) {}

  async execute({ annotationId }: GetByIdUseCaseReq): Promise<Annotation> {
    const annotation = await this.annotationRepository.getById(annotationId)

    if (!annotation) {
      throw new ErrorHandler(400, 'Annotation not found, try again')
    }

    return annotation
  }
}
