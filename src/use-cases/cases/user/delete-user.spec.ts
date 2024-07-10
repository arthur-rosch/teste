import Chance from 'chance'
import { DeleteUser } from './delete-user'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ErrorHandler } from '@/http/middleware/errorResponse'
import { InMemoryEmailTokenRepository, InMemoryUserRepository } from '@/repository/in-memory/'

const chance = new Chance()

let emailRepository: InMemoryEmailTokenRepository
let userRepository: InMemoryUserRepository
let sut: DeleteUser

beforeEach(() => {
  userRepository = new InMemoryUserRepository()
  emailRepository = new InMemoryEmailTokenRepository()
  sut = new DeleteUser(userRepository, emailRepository);
})

const user = {
  id: chance.guid({ version: 4 }),
  name: chance.string(),
  email: chance.email(),
  phone: chance.phone(),
  gender: chance.gender(),
  dateBirth: chance.date().toISOString(),
  password: chance.guid({ version: 4 }),
};

describe('Delete User Test', () => {
  it('should delete the user successfully', async () => {
    vi.spyOn(userRepository, 'getUser').mockResolvedValue(user)

    await expect(sut.execute({ email: user.email })).toBeDefined()
  })

  it('should return an error, user does not exist', async () => {
    vi.spyOn(userRepository, 'getUser').mockResolvedValueOnce(null)

    await expect(sut.execute(user)).rejects.toThrow(
      new ErrorHandler(400, 'User not exists, try again'),
    )
  })
})
