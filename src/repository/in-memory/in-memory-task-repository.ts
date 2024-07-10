import { Task, Prisma, Status } from '@prisma/client'
import { ITaskRepository } from '@/repository'

class InMemoryTaskRepository implements ITaskRepository {
  private tasks: Task[] = []

  async findById(taskId: string): Promise<Task | null> {
    const task = this.tasks.find((task) => task.id === taskId)
    return task || null
  }

  async delete(taskId: string): Promise<void> {
    this.tasks = this.tasks.filter((task) => task.id !== taskId)
  }

  async create(data: Prisma.TaskUncheckedCreateInput): Promise<Task> {
    const newTask: Task = {
      id: '1',
      title: data.title,
      information: data.information || '',
      status: data.status || 'To_Do',
      projectId: data.projectId,
      responsibleId: data.responsibleId!,
      createdAt: new Date(),
      updatedAt: new Date(),
      files: '',
    }

    this.tasks.push(newTask)
    return newTask
  }

  async updateStatus(taskId: string, status: Status): Promise<Task> {
    const task = this.tasks.find((task) => task.id === taskId)

    if (!task) {
      throw new Error('Task not found')
    }

    task.status = status
    task.updatedAt = new Date()

    return task
  }
}

export { InMemoryTaskRepository }
