import { Annotation, Prisma } from '@prisma/client'
import { IAnnotationRepository } from '@/repository'

export class InMemoryAnnotationRepository implements IAnnotationRepository {
  private annotations: Annotation[] = []

  async delete(annotationId: string): Promise<Annotation> {
    const annotationIndex = this.annotations.findIndex(
      (annotation) => annotation.id === annotationId,
    )

    const [deletedAnnotation] = this.annotations.splice(annotationIndex, 1)
    return deletedAnnotation
  }

  async getByUserId(userId: string): Promise<Annotation[]> {
    return this.annotations.filter((annotation) => annotation.userId === userId)
  }

  async getById(annotationId: string): Promise<Annotation | null> {
    return (
      this.annotations.find((annotation) => annotation.id === annotationId) ||
      null
    )
  }

  async create(
    data: Prisma.AnnotationUncheckedCreateInput,
  ): Promise<Annotation> {
    const annotation = {
      id: (this.annotations.length + 1).toString(),
      ...data,
    }

    this.annotations.push(annotation)
    return annotation
  }
}
