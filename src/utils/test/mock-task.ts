import { chance } from '@/lib'
import { Prisma, Task } from '@prisma/client'
import { createMockUserAndProject } from './mock-user-and-project'
import {
  InMemoryProjectRepository,
  InMemoryTaskRepository,
  InMemoryUserRepository,
} from '@/repository/in-memory'

export async function createMockTask(
  userRepository: InMemoryUserRepository,
  projectRepository: InMemoryProjectRepository,
  taskRepository: InMemoryTaskRepository,
): Promise<Task> {
  const { user, project } = await createMockUserAndProject(
    userRepository,
    projectRepository,
  )

  const taskData: Prisma.TaskUncheckedCreateInput = {
    title: chance.sentence({ words: 3 }),
    information: chance.paragraph(),
    files: chance.url(),
    status: 'To_Do',
    projectId: project.id,
    responsibleId: user.id,
  }

  const task = await taskRepository.create(taskData)

  return task
}
