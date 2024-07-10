import { Annotation, Prisma } from '@prisma/client'

export interface IAnnotationRepository {
  delete(annotationId: string): Promise<Annotation>
  getByUserId(annotationId: string): Promise<Annotation[]>
  getById(annotationId: string): Promise<Annotation | null>
  create(data: Prisma.AnnotationUncheckedCreateInput): Promise<Annotation>
}
