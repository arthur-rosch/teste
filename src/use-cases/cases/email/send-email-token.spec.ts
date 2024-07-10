import Chance from 'chance'
import {
  InMemoryEmailTokenRepository,
  InMemoryUserRepository,
} from '@/repository/in-memory'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SendEmailTokenUseCase } from './send-email-token'
import { SendEmailToken } from '@/service/sendEmail'
import { ErrorHandler } from '@/http/middleware/errorResponse'

const chance = new Chance()

let emailService: SendEmailToken
let emailRepository: InMemoryEmailTokenRepository
let userRepository: InMemoryUserRepository
let sut: SendEmailTokenUseCase

beforeEach(() => {
  userRepository = new InMemoryUserRepository()
  emailRepository = new InMemoryEmailTokenRepository()
  emailService = new SendEmailToken()
  sut = new SendEmailTokenUseCase(userRepository, emailService, emailRepository)
})

const user = {
  id: chance.guid({ version: 4 }),
  name: chance.name(),
  email: chance.email(),
  phone: chance.phone(),
  gender: chance.gender(),
  dateBirth: chance.date().toISOString(),
  password: chance.guid({ version: 4 }),
}

describe('Send Email Token Use Case Test', () => {
  it('should send the token to the email successfully', async () => {
    vi.spyOn(userRepository, 'getUser').mockResolvedValue(user)

    vi.spyOn(emailRepository, 'checkEmailToken').mockResolvedValue(null)

    vi.spyOn(emailService, 'send')

    vi.spyOn(emailRepository, 'create')

    await sut.execute(user.email)

    expect(userRepository.getUser).toHaveBeenCalledWith({ email: user.email })
    expect(emailRepository.checkEmailToken).toHaveBeenCalledWith(user.email)
    expect(emailService.send).toHaveBeenCalledWith(
      user.email,
      expect.any(String),
    )
    expect(emailRepository.create).toHaveBeenCalledWith({
      email: user.email,
      token: expect.any(String),
      validated: false,
      attempts: 0,
    })
  })

  it('should return error, user not exist', async () => {
    vi.spyOn(userRepository, 'getUser').mockResolvedValue(null)

    await expect(sut.execute(user.email)).rejects.toThrow(
      new ErrorHandler(400, 'User not exists, try again'),
    )
  })
})
