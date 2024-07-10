import { ClientType } from '@prisma/client'
import { ErrorHandler } from '@/http/middleware/errorResponse'
import { GetAllReceivableByUserIdUseCase } from './get-all-receivable-by-user-id'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  InMemoryFinancialRepository,
  InMemoryUserRepository,
} from '@/repository/in-memory'
import { chance } from '@/lib'

let financialRepository: InMemoryFinancialRepository
let userRepository: InMemoryUserRepository
let sut: GetAllReceivableByUserIdUseCase

beforeEach(() => {
  financialRepository = new InMemoryFinancialRepository()
  userRepository = new InMemoryUserRepository()
  sut = new GetAllReceivableByUserIdUseCase(financialRepository, userRepository)
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
  id: 'financial-id-1',
  userId: user.id,
}

const client = {
  id: chance.guid({ version: 4 }),
  address: chance.address(),
  email: chance.email(),
  name: chance.name(),
  phone: chance.phone(),
  type: ClientType.CLIENT,
  financialRegistrationId: financialRegistration.id,
}

const receivables = [
  {
    id: 'receivable-id-1',
    amountToReceive: 1000,
    serviceStartDate: new Date('2023-01-01'),
    serviceEndDate: new Date('2023-12-31'),
    serviceProvided: 'Consulting',
    clientId: client.id,
    financialRegistrationId: financialRegistration.id,
  },
  {
    id: 'receivable-id-2',
    amountToReceive: 1500,
    serviceStartDate: new Date('2023-02-01'),
    serviceEndDate: new Date('2023-12-31'),
    serviceProvided: 'Development',
    clientId: client.id,
    financialRegistrationId: financialRegistration.id,
  },
]

describe('GetAllReceivableByUserIdUseCase', () => {
  it('should return all receivables for a user', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
    vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue(
      financialRegistration,
    )
    vi.spyOn(
      financialRepository,
      'getAllReceivableByFinancialId',
    ).mockResolvedValue(receivables)

    const result = await sut.execute({
      userId: user.id,
    })

    expect(result).toEqual(receivables)
    expect(userRepository.getUserById).toHaveBeenCalledWith(user.id)
    expect(financialRepository.getFinancial).toHaveBeenCalledWith(user.id)
    expect(
      financialRepository.getAllReceivableByFinancialId,
    ).toHaveBeenCalledWith(financialRegistration.id)
  })

  it('should throw an error if user is not found', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(null)

    await expect(
      sut.execute({
        userId: user.id,
      }),
    ).rejects.toThrow(new ErrorHandler(400, 'User Not Found, try again'))
  })

  it('should throw an error if financial registration is not found', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
    vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue(null)

    await expect(
      sut.execute({
        userId: user.id,
      }),
    ).rejects.toThrow(new ErrorHandler(400, 'Financial Not Found, try again'))
  })
})
