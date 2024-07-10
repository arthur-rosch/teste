import { chance } from '@/lib'
import { ClientType } from '@prisma/client'
import { EditClientUseCase } from './edit-client'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ErrorHandler } from '@/http/middleware/errorResponse'
import {
  InMemoryFinancialRepository,
  InMemoryUserRepository,
} from '@/repository/in-memory'

let financialRepository: InMemoryFinancialRepository
let userRepository: InMemoryUserRepository
let sut: EditClientUseCase

beforeEach(() => {
  financialRepository = new InMemoryFinancialRepository()
  userRepository = new InMemoryUserRepository()
  sut = new EditClientUseCase(financialRepository, userRepository)
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

const updatedClientData = {
  ...clientData,
  address: chance.address(),
  email: chance.email(),
  name: chance.name(),
  phone: chance.phone(),
}

describe('EditClientUseCase', () => {
  it('should edit a client successfully', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
    vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue(
      financialRegistration,
    )
    vi.spyOn(financialRepository, 'getClientById').mockResolvedValue(clientData)
    vi.spyOn(financialRepository, 'editClient').mockResolvedValue(
      updatedClientData,
    )

    const result = await sut.execute({
      address: updatedClientData.address,
      email: updatedClientData.email,
      name: updatedClientData.name,
      phone: updatedClientData.phone,
      type: updatedClientData.type,
      userId: user.id,
      clientId: clientData.id,
      financialRegistrationId: financialRegistration.id,
    })

    expect(result).toEqual(updatedClientData)
    expect(userRepository.getUserById).toHaveBeenCalledWith(user.id)
    expect(financialRepository.getFinancial).toHaveBeenCalledWith(
      financialRegistration.id,
    )
    expect(financialRepository.getClientById).toHaveBeenCalledWith(
      clientData.id,
    )
    expect(financialRepository.editClient).toHaveBeenCalledWith(clientData.id, {
      address: updatedClientData.address,
      email: updatedClientData.email,
      name: updatedClientData.name,
      phone: updatedClientData.phone,
      type: updatedClientData.type,
      financialRegistrationId: updatedClientData.financialRegistrationId,
    })
  })

  it('should throw an error if user is not found', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(null)

    await expect(
      sut.execute({
        address: updatedClientData.address,
        email: updatedClientData.email,
        name: updatedClientData.name,
        phone: updatedClientData.phone,
        type: updatedClientData.type,
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
        address: updatedClientData.address,
        email: updatedClientData.email,
        name: updatedClientData.name,
        phone: updatedClientData.phone,
        type: updatedClientData.type,
        userId: user.id,
        clientId: clientData.id,
        financialRegistrationId: financialRegistration.id,
      }),
    ).rejects.toThrow(
      new ErrorHandler(400, 'Unauthorized, Only owner can edit'),
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
        address: updatedClientData.address,
        email: updatedClientData.email,
        name: updatedClientData.name,
        phone: updatedClientData.phone,
        type: updatedClientData.type,
        userId: user.id,
        clientId: clientData.id,
        financialRegistrationId: financialRegistration.id,
      }),
    ).rejects.toThrow(new ErrorHandler(400, 'Client Not Found, try again'))
  })
})
