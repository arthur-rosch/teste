import { expect, describe, it, beforeEach } from 'vitest'
import { GetByUserIdUseCase } from './get-by-user-id'
import {
  InMemoryAnnotationRepository,
  InMemoryUserRepository,
} from '@/repository/in-memory'
import { ErrorHandler } from '@/http/middleware/errorResponse'
import { createMockUser } from '@/utils'

let annotationRepository: InMemoryAnnotationRepository
let userRepository: InMemoryUserRepository
let sut: GetByUserIdUseCase

describe('Get Annotations By User Id Use Case', () => {
  beforeEach(() => {
    annotationRepository = new InMemoryAnnotationRepository()
    userRepository = new InMemoryUserRepository()
    sut = new GetByUserIdUseCase(annotationRepository, userRepository)
  })

  it('should be able to get annotations by user id', async () => {
    const { id } = await createMockUser(userRepository)

    const annotation1 = await annotationRepository.create({
      id: '1',
      color: 'blue',
      information: 'This is a test annotation 1',
      title: 'Test Annotation 1',
      userId: id,
    })

    const annotation2 = await annotationRepository.create({
      id: '2',
      color: 'green',
      information: 'This is a test annotation 2',
      title: 'Test Annotation 2',
      userId: id,
    })

    const annotations = await sut.execute({ userId: id })

    expect(annotations).toEqual([annotation1, annotation2])
  })

  it('should throw an error if user not found', async () => {
    await expect(
      sut.execute({ userId: 'non-existent-user' }),
    ).rejects.toBeInstanceOf(ErrorHandler)
  })
})
