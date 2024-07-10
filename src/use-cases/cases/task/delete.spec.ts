import { createMockTask } from '@/utils'
import { DeleteTaskUseCase } from './delete'
import { describe, it, expect, beforeEach } from 'vitest'
import { ErrorHandler } from '@/http/middleware/errorResponse'
import {
  InMemoryTaskRepository,
  InMemoryUserRepository,
  InMemoryProjectRepository,
} from '@/repository/in-memory'
import { Task } from '@prisma/client'

let mockTask: Task
let sut: DeleteTaskUseCase
let taskRepository: InMemoryTaskRepository
let userRepository: InMemoryUserRepository
let projectRepository: InMemoryProjectRepository

describe('Delete Task Use Case', () => {
  beforeEach(async () => {
    taskRepository = new InMemoryTaskRepository()
    userRepository = new InMemoryUserRepository()
    projectRepository = new InMemoryProjectRepository()
    sut = new DeleteTaskUseCase(taskRepository, userRepository)
    mockTask = await createMockTask(
      userRepository,
      projectRepository,
      taskRepository,
    )
  })

  it('should be able to delete a task', async () => {
    const result = await sut.execute(mockTask.id, mockTask.responsibleId!)

    const deletedTask = await taskRepository.findById(mockTask.id)

    expect(result).toEqual({ message: 'Task deleted successfully' })
    expect(deletedTask).toBeNull()
  })

  it('should not be able to delete a task if user does not exist', async () => {
    await expect(
      sut.execute(mockTask.id, 'nonexistent-user-id'),
    ).rejects.toBeInstanceOf(ErrorHandler)
  })

  it('should not be able to delete a task if task does not exist', async () => {
    await expect(
      sut.execute('nonexistent-task-id', 'user-id'),
    ).rejects.toBeInstanceOf(ErrorHandler)
  })
})
