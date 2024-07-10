import { chance } from '@/lib'
import { GetAllClientByUserIdUseCase } from './get-all-client-by-user-id'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ErrorHandler } from '@/http/middleware/errorResponse'
import {
  InMemoryFinancialRepository,
  InMemoryUserRepository,
} from '@/repository/in-memory'
import { ClientType } from '@prisma/client'

let financialRepository: InMemoryFinancialRepository
let userRepository: InMemoryUserRepository
let sut: GetAllClientByUserIdUseCase

beforeEach(() => {
  financialRepository = new InMemoryFinancialRepository()
  userRepository = new InMemoryUserRepository()
  sut = new GetAllClientByUserIdUseCase(financialRepository, userRepository)
})

const user = {
  id: chance.guid({ version: 4 }),
  name: chance.name(),
  email: chance.email(),
  phone: chance.phone(),
  gender: chance.gender(),
  password: chance.name(),
  dateBirth: '22/08/2005',
}

const financialRegistration = {
  id: chance.guid({ version: 4 }),
  userId: user.id,
}

const clients = [
  {
    id: chance.guid({ version: 4 }),
    address: chance.address(),
    email: chance.email(),
    name: chance.name(),
    phone: chance.phone(),
    type: ClientType.CLIENT,
    financialRegistrationId: financialRegistration.id,
  },
  {
    id: chance.guid({ version: 4 }),
    address: chance.address(),
    email: chance.email(),
    name: chance.name(),
    phone: chance.phone(),
    type: ClientType.CLIENT,
    financialRegistrationId: financialRegistration.id,
  },
]

describe('GetAllClientByUserIdUseCase', () => {
  it('should get all clients successfully', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
    vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue(
      financialRegistration,
    )
    vi.spyOn(
      financialRepository,
      'getAllClientByFinancialId',
    ).mockResolvedValue(clients)

    const result = await sut.execute({ userId: user.id })

    expect(result).toEqual(clients)
    expect(userRepository.getUserById).toHaveBeenCalledWith(user.id)
    expect(financialRepository.getFinancial).toHaveBeenCalledWith(user.id)
    expect(financialRepository.getAllClientByFinancialId).toHaveBeenCalledWith(
      financialRegistration.id,
    )
  })

  it('should throw an error if user is not found', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(null)

    await expect(sut.execute({ userId: user.id })).rejects.toThrow(
      new ErrorHandler(400, 'User Not Found, try again'),
    )
  })

  it('should throw an error if financial registration is not found', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
    vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue(null)

    await expect(sut.execute({ userId: user.id })).rejects.toThrow(
      new ErrorHandler(400, 'Financial Not Found, try again'),
    )
  })
})
