import { hash } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'
import { ErrorHandler } from '@/http/middleware/errorResponse'
import { UpdateStatusPrivacyProjectUseCase } from './update-status-privacy'
import {
  InMemoryProjectRepository,
  InMemoryUserRepository,
} from '@/repository/in-memory'
import { Privacy } from '@prisma/client'

let userRepository: InMemoryUserRepository
let projectRepository: InMemoryProjectRepository
let sut: UpdateStatusPrivacyProjectUseCase

describe('Update Status Privacy Project Use Case', () => {
  beforeEach(() => {
    projectRepository = new InMemoryProjectRepository()
    userRepository = new InMemoryUserRepository()
    sut = new UpdateStatusPrivacyProjectUseCase(
      projectRepository,
      userRepository,
    )
  })

  it('should be able to update project status privacy', async () => {
    const { id: ownerId } = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: await hash('123456', 6),
    })

    const project = await projectRepository.create({
      color: 'green',
      name: 'Project 1',
      privacy: Privacy.Public,
      ownerId,
      usersIds: [ownerId],
    })

    const updatedProject = await sut.execute(
      project.id,
      ownerId,
      Privacy.Private,
    )

    expect(updatedProject.privacy).toBe(Privacy.Private)
  })

  it('should not be able to update project status privacy with wrong owner id', async () => {
    const { id: ownerId } = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: await hash('123456', 6),
    })

    const { id: otherUserId } = await userRepository.create({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: await hash('123456', 6),
    })

    const project = await projectRepository.create({
      color: 'green',
      name: 'Project 1',
      privacy: Privacy.Public,
      ownerId,
      usersIds: [ownerId],
    })

    await expect(() =>
      sut.execute(project.id, otherUserId, Privacy.Private),
    ).rejects.toBeInstanceOf(ErrorHandler)
  })

  it('should not be able to update status privacy of non-existent project', async () => {
    const { id: ownerId } = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute('non-existent-project-id', ownerId, Privacy.Private),
    ).rejects.toThrow('Project does not exist')
  })

  it('should not be able to update status privacy with non-existent owner', async () => {
    const { id: ownerId } = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: await hash('123456', 6),
    })

    const project = await projectRepository.create({
      color: 'green',
      name: 'Project 1',
      privacy: Privacy.Public,
      ownerId,
      usersIds: [ownerId],
    })

    await userRepository.deleteUser({ email: 'johndoe@example.com' })

    await expect(() =>
      sut.execute(project.id, ownerId, Privacy.Private),
    ).rejects.toBeInstanceOf(ErrorHandler)
  })
})
