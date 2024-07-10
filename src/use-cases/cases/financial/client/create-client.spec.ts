import { chance } from '@/lib'
import { ClientType } from '@prisma/client'
import { CreateClientUseCase } from './create-client'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ErrorHandler } from '@/http/middleware/errorResponse'
import {
  InMemoryFinancialRepository,
  InMemoryUserRepository,
} from '@/repository/in-memory'

let financialRepository: InMemoryFinancialRepository
let userRepository: InMemoryUserRepository
let sut: CreateClientUseCase

beforeEach(() => {
  financialRepository = new InMemoryFinancialRepository()
  userRepository = new InMemoryUserRepository()
  sut = new CreateClientUseCase(financialRepository, userRepository)
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

const clientData = {
  id: chance.guid({ version: 4 }),
  address: chance.address(),
  email: chance.email(),
  name: chance.name(),
  phone: chance.phone(),
  type: ClientType.CLIENT,
  financialRegistrationId: financialRegistration.id,
}

describe('CreateClientUseCase', () => {
  it('should create a client successfully', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
    vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue(null)
    vi.spyOn(financialRepository, 'createFinancial').mockResolvedValue(
      financialRegistration,
    )
    vi.spyOn(financialRepository, 'createClient').mockResolvedValue(clientData)

    const result = await sut.execute({
      address: clientData.address,
      email: clientData.email,
      name: clientData.name,
      phone: clientData.phone,
      type: clientData.type,
      userId: user.id,
    })

    expect(result).toEqual(clientData)
    expect(userRepository.getUserById).toHaveBeenCalledWith(user.id)
    expect(financialRepository.getFinancial).toHaveBeenCalledWith(user.id)
    expect(financialRepository.createFinancial).toHaveBeenCalledWith(user.id)
    expect(financialRepository.createClient).toHaveBeenCalledWith({
      address: clientData.address,
      email: clientData.email,
      name: clientData.name,
      phone: clientData.phone,
      type: clientData.type,
      financialRegistrationId: financialRegistration.id,
    })
  })

  it('should throw an error if user is not found', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(null)

    await expect(
      sut.execute({
        address: clientData.address,
        email: clientData.email,
        name: clientData.name,
        phone: clientData.phone,
        type: clientData.type,
        userId: user.id,
      }),
    ).rejects.toThrow(new ErrorHandler(400, 'User Not Found, try again'))
  })
})
