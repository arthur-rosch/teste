import { hash } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'
import { ErrorHandler } from '@/http/middleware/errorResponse'
import { GetProjectsByUserIdUseCase } from './get-projects-by-user-id'
import {
  InMemoryProjectRepository,
  InMemoryUserRepository,
} from '@/repository/in-memory'

let userRepository: InMemoryUserRepository
let projectRepository: InMemoryProjectRepository
let sut: GetProjectsByUserIdUseCase

describe('Get Projects By UserId Use Case', () => {
  beforeEach(() => {
    projectRepository = new InMemoryProjectRepository()
    userRepository = new InMemoryUserRepository()
    sut = new GetProjectsByUserIdUseCase(projectRepository, userRepository)
  })

  it('should be able to get projects by user id', async () => {
    const { id: userId } = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: await hash('123456', 6),
    })

    const project1 = await projectRepository.create({
      color: 'green',
      name: 'Project 1',
      privacy: 'Public',
      ownerId: userId,
      usersIds: [userId],
    })

    const project2 = await projectRepository.create({
      color: 'blue',
      name: 'Project 2',
      privacy: 'Private',
      ownerId: userId,
      usersIds: [userId],
    })

    const projects = await sut.execute(userId)

    expect(projects).toHaveLength(2)
    expect(projects).toEqual(expect.arrayContaining([project1, project2]))
  })

  it('should not be able to get projects with non-existent user id', async () => {
    await expect(() =>
      sut.execute('non-existent-user-id'),
    ).rejects.toBeInstanceOf(ErrorHandler)
  })

  it('should return empty array if user has no projects', async () => {
    const { id: userId } = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: await hash('123456', 6),
    })

    const projects = await sut.execute(userId)

    expect(projects).toHaveLength(0)
  })
})
