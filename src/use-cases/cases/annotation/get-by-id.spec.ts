import { expect, describe, it, beforeEach } from 'vitest'
import { GetByIdUseCase } from './get-by-id'
import {
  InMemoryAnnotationRepository,
  InMemoryUserRepository,
} from '@/repository/in-memory'
import { ErrorHandler } from '@/http/middleware/errorResponse'
import { createMockUser } from '@/utils'

let annotationRepository: InMemoryAnnotationRepository
let userRepository: InMemoryUserRepository
let sut: GetByIdUseCase

describe('Get Annotation By Id Use Case', () => {
  beforeEach(() => {
    annotationRepository = new InMemoryAnnotationRepository()
    userRepository = new InMemoryUserRepository()
    sut = new GetByIdUseCase(annotationRepository)
  })

  it('should be able to get an annotation by id', async () => {
    const { id } = await createMockUser(userRepository)

    const createdAnnotation = await annotationRepository.create({
      id: '1',
      color: 'blue',
      information: 'This is a test annotation',
      title: 'Test Annotation',
      userId: id,
    })

    const annotation = await sut.execute({ annotationId: createdAnnotation.id })

    expect(annotation).toEqual(createdAnnotation)
  })

  it('should throw an error if annotation not found', async () => {
    await expect(
      sut.execute({ annotationId: 'non-existent-annotation' }),
    ).rejects.toBeInstanceOf(ErrorHandler)
  })
})
