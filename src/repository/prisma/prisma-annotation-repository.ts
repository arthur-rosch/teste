import { Annotation, Prisma, PrismaClient } from '@prisma/client'
import { IAnnotationRepository } from '../annotation'

export class AnnotationRepository implements IAnnotationRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async delete(annotationId: string): Promise<Annotation> {
    const annotationDeleted = await this.prisma.annotation.delete({
      where: {
        id: annotationId,
      },
    })

    return annotationDeleted
  }

  async getByUserId(userId: string): Promise<Annotation[]> {
    return await this.prisma.annotation.findMany({
      where: {
        userId,
      },
    })
  }

  async getById(id: string): Promise<Annotation | null> {
    return await this.prisma.annotation.findUnique({
      where: {
        id,
      },
    })
  }

  async create(
    data: Prisma.AnnotationUncheckedCreateInput,
  ): Promise<Annotation> {
    const annotation = await this.prisma.annotation.create({
      data,
    })

    return annotation
  }
}
