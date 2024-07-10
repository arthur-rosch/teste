// TaskRepository.ts
import { PrismaClient, Task, Prisma, Status } from '@prisma/client'
import { ITaskRepository } from '@/repository'

const prisma = new PrismaClient()

export class TaskRepository implements ITaskRepository {
  async delete(taskId: string): Promise<void> {
    await prisma.task.delete({
      where: { id: taskId },
    })
  }

  async create(data: Prisma.TaskUncheckedCreateInput): Promise<Task> {
    return await prisma.task.create({
      data,
    })
  }

  async updateStatus(taskId: string, status: Status): Promise<Task> {
    return await prisma.task.update({
      where: { id: taskId },
      data: { status },
    })
  }

  async findById(taskId: string): Promise<Task | null> {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    })

    if (!task) return null

    return task
  }
}
