import Chance from 'chance'
import { createMockUser } from './mock-user'
import {
  InMemoryProjectRepository,
  InMemoryUserRepository,
} from '@/repository/in-memory'

const chance = new Chance()

export async function createMockUserAndProject(
  userRepository: InMemoryUserRepository,
  projectRepository: InMemoryProjectRepository,
) {
  const user = await createMockUser(userRepository)

  const project = await projectRepository.create({
    name: chance.word({ length: 5 }),
    color: chance.color({ format: 'hex' }),
    ownerId: user.id,
    usersIds: [user.id],
    privacy: 'Private',
  })

  return { user, project }
}
