import { chance } from '@/lib'
import { DeleteClientUseCase } from './delete-client'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ErrorHandler } from '@/http/middleware/errorResponse'
import {
  InMemoryFinancialRepository,
  InMemoryUserRepository,
} from '@/repository/in-memory'
import { ClientType } from '@prisma/client'

let financialRepository: InMemoryFinancialRepository
let userRepository: InMemoryUserRepository
let sut: DeleteClientUseCase

beforeEach(() => {
  financialRepository = new InMemoryFinancialRepository()
  userRepository = new InMemoryUserRepository()
  sut = new DeleteClientUseCase(financialRepository, userRepository)
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

describe('DeleteClientUseCase', () => {
  it('should delete a client successfully', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
    vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue(
      financialRegistration,
    )
    vi.spyOn(financialRepository, 'getClientById').mockResolvedValue(clientData)
    vi.spyOn(financialRepository, 'deleteClient').mockResolvedValue(clientData)

    const result = await sut.execute({
      userId: user.id,
      clientId: clientData.id,
      financialRegistrationId: financialRegistration.id,
    })

    expect(result).toEqual(clientData)
    expect(userRepository.getUserById).toHaveBeenCalledWith(user.id)
    expect(financialRepository.getFinancial).toHaveBeenCalledWith(
      financialRegistration.id,
    )
    expect(financialRepository.getClientById).toHaveBeenCalledWith(
      clientData.id,
    )
    expect(financialRepository.deleteClient).toHaveBeenCalledWith(clientData.id)
  })

  it('should throw an error if user is not found', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(null)

    await expect(
      sut.execute({
        userId: user.id,
        clientId: clientData.id,
        financialRegistrationId: financialRegistration.id,
      }),
    ).rejects.toThrow(new ErrorHandler(400, 'User Not Found, try again'))
  })

  it('should throw an error if financial registration does not match user', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
    vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue({
      ...financialRegistration,
      userId: 'different-user-id',
    })

    await expect(
      sut.execute({
        userId: user.id,
        clientId: clientData.id,
        financialRegistrationId: financialRegistration.id,
      }),
    ).rejects.toThrow(
      new ErrorHandler(400, 'Unauthorized, Only owner can delete'),
    )
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
        clientId: clientData.id,
        financialRegistrationId: financialRegistration.id,
      }),
    ).rejects.toThrow(new ErrorHandler(400, 'Client Not Found, try again'))
  })
})
