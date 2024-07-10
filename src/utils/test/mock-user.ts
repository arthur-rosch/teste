import Chance from 'chance'
import { hash } from 'bcryptjs'
import { InMemoryUserRepository } from '@/repository/in-memory/'

const chance = new Chance()

export async function createMockUser(userRepository: InMemoryUserRepository) {
  const name = chance.name()
  const email = chance.email()
  const password = await hash(chance.string({ length: 8 }), 6)

  return await userRepository.create({
    name,
    email,
    password,
  })
}
