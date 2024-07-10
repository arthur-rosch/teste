import { UpdateTaskStatusUseCase } from './update-status'
import { describe, it, expect, beforeEach } from 'vitest'
import { ErrorHandler } from '@/http/middleware/errorResponse'
import {
  InMemoryProjectRepository,
  InMemoryTaskRepository,
  InMemoryUserRepository,
} from '@/repository/in-memory'
import { Status, Task } from '@prisma/client'
import { createMockTask } from '@/utils'

let mockTask: Task
let sut: UpdateTaskStatusUseCase
let taskRepository: InMemoryTaskRepository
let userRepository: InMemoryUserRepository
let projectRepository: InMemoryProjectRepository

describe('Update Task Status Use Case', () => {
  beforeEach(async () => {
    taskRepository = new InMemoryTaskRepository()
    userRepository = new InMemoryUserRepository()
    projectRepository = new InMemoryProjectRepository()
    sut = new UpdateTaskStatusUseCase(taskRepository, userRepository)
    mockTask = await createMockTask(
      userRepository,
      projectRepository,
      taskRepository,
    )
  })

  it('should update task status', async () => {
    const newStatus: Status = 'Testing'

    const updatedTask = await sut.execute(
      mockTask.id,
      newStatus,
      mockTask.responsibleId!,
    )

    expect(updatedTask.id).toBe(mockTask.id)
    expect(updatedTask.status).toBe(newStatus)
  })

  it('should not update task status if user does not exist', async () => {
    const newStatus: Status = 'Testing'

    await expect(
      sut.execute(mockTask.id, newStatus, 'nonexistent-user-id'),
    ).rejects.toBeInstanceOf(ErrorHandler)
  })

  it('should not update task status if task does not exist', async () => {
    const newStatus: Status = 'Testing'

    await expect(
      sut.execute('nonexistent-task-id', newStatus, mockTask.responsibleId!),
    ).rejects.toBeInstanceOf(ErrorHandler)
  })
})
