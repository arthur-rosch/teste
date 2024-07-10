import { Task, Prisma, Status } from '@prisma/client'

export interface ITaskRepository {
  findById(taskId: string): Promise<Task | null>
  delete(taskId: string): Promise<void>
  create(data: Prisma.TaskUncheckedCreateInput): Promise<Task>
  updateStatus(taskId: string, status: Status): Promise<Task>
}
