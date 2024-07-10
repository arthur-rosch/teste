import { ErrorHandler } from '@/http/middleware/errorResponse'
import { CreateReceivableUseCase } from './create-receivable'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  InMemoryFinancialRepository,
  InMemoryUserRepository,
} from '@/repository/in-memory'
import { chance } from '@/lib'
import { ClientType } from '@prisma/client'

let financialRepository: InMemoryFinancialRepository
let userRepository: InMemoryUserRepository
let sut: CreateReceivableUseCase

beforeEach(() => {
  financialRepository = new InMemoryFinancialRepository()
  userRepository = new InMemoryUserRepository()
  sut = new CreateReceivableUseCase(financialRepository, userRepository)
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

describe('CreateReceivableUseCase', () => {
  it('should create a receivable successfully', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
    vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue(
      financialRegistration,
    )
    vi.spyOn(financialRepository, 'getClientById').mockResolvedValue(client)
    vi.spyOn(financialRepository, 'createReceivable').mockResolvedValue({
      id: 'receivable-id-1',
      amountToReceive: 1000,
      serviceStartDate: new Date('2023-01-01'),
      serviceEndDate: new Date('2023-12-31'),
      serviceProvided: 'Consulting',
      clientId: client.id,
      financialRegistrationId: financialRegistration.id,
    })

    const result = await sut.execute({
      userId: user.id,
      clientId: client.id,
      amountToReceive: 1000,
      serviceStartDate: new Date('2023-01-01'),
      serviceEndDate: new Date('2023-12-31'),
      serviceProvided: 'Consulting',
    })

    expect(result).toEqual({
      id: 'receivable-id-1',
      amountToReceive: 1000,
      serviceStartDate: new Date('2023-01-01'),
      serviceEndDate: new Date('2023-12-31'),
      serviceProvided: 'Consulting',
      clientId: client.id,
      financialRegistrationId: financialRegistration.id,
    })
    expect(userRepository.getUserById).toHaveBeenCalledWith(user.id)
    expect(financialRepository.getFinancial).toHaveBeenCalledWith(user.id)
    expect(financialRepository.getClientById).toHaveBeenCalledWith(client.id)
    expect(financialRepository.createReceivable).toHaveBeenCalledWith({
      amountToReceive: 1000,
      serviceStartDate: new Date('2023-01-01'),
      serviceEndDate: new Date('2023-12-31'),
      serviceProvided: 'Consulting',
      clientId: client.id,
      financialRegistrationId: financialRegistration.id,
    })
  })

  it('should throw an error if user is not found', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(null)

    await expect(
      sut.execute({
        userId: user.id,
        clientId: client.id,
        amountToReceive: 1000,
        serviceStartDate: new Date('2023-01-01'),
        serviceEndDate: new Date('2023-12-31'),
        serviceProvided: 'Consulting',
      }),
    ).rejects.toThrow(new ErrorHandler(400, 'User Not Found, try again'))
  })

  it('should throw an error if financial registration is not found', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
    vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue(null)

    await expect(
      sut.execute({
        userId: user.id,
        clientId: client.id,
        amountToReceive: 1000,
        serviceStartDate: new Date('2023-01-01'),
        serviceEndDate: new Date('2023-12-31'),
        serviceProvided: 'Consulting',
      }),
    ).rejects.toThrow(new ErrorHandler(400, 'Financial Not Found, try again'))
  })

  it('should throw an error if client is not found', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
    vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue(
      financialRegistration,
    )
    vi.spyOn(financialRepository, 'getClientById').mockResolvedValue(null)

    await expect(
      sut.execute({
        userId: user.id,
        clientId: client.id,
        amountToReceive: 1000,
        serviceStartDate: new Date('2023-01-01'),
        serviceEndDate: new Date('2023-12-31'),
        serviceProvided: 'Consulting',
      }),
    ).rejects.toThrow(new ErrorHandler(400, 'Client Not Found, try again'))
  })
})
