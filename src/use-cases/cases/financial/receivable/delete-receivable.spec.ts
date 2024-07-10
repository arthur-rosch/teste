import { ErrorHandler } from '@/http/middleware/errorResponse'
import { DeleteReceivableUseCase } from './delete-receivable'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  InMemoryFinancialRepository,
  InMemoryUserRepository,
} from '@/repository/in-memory'
import { chance } from '@/lib'

let financialRepository: InMemoryFinancialRepository
let userRepository: InMemoryUserRepository
let sut: DeleteReceivableUseCase

beforeEach(() => {
  financialRepository = new InMemoryFinancialRepository()
  userRepository = new InMemoryUserRepository()
  sut = new DeleteReceivableUseCase(financialRepository, userRepository)
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

const receivable = {
  id: 'receivable-id-1',
  amountToReceive: 1000,
  serviceStartDate: new Date('2023-01-01'),
  serviceEndDate: new Date('2023-12-31'),
  serviceProvided: 'Consulting',
  clientId: 'client-id-1',
  financialRegistrationId: financialRegistration.id,
}

describe('DeleteReceivableUseCase', () => {
  it('should delete a receivable successfully', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
    vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue(
      financialRegistration,
    )
    vi.spyOn(financialRepository, 'getReceivableById').mockResolvedValue(
      receivable,
    )
    vi.spyOn(financialRepository, 'deleteReceivable').mockResolvedValue(
      receivable,
    )

    const result = await sut.execute({
      userId: user.id,
      receivableId: receivable.id,
      financialRegistrationId: financialRegistration.id,
    })

    expect(result).toEqual(receivable)
    expect(userRepository.getUserById).toHaveBeenCalledWith(user.id)
    expect(financialRepository.getFinancial).toHaveBeenCalledWith(user.id)
    expect(financialRepository.getReceivableById).toHaveBeenCalledWith(
      receivable.id,
    )
    expect(financialRepository.deleteReceivable).toHaveBeenCalledWith(
      receivable.id,
    )
  })

  it('should throw an error if user is not found', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(null)

    await expect(
      sut.execute({
        userId: user.id,
        receivableId: receivable.id,
        financialRegistrationId: financialRegistration.id,
      }),
    ).rejects.toThrow(new ErrorHandler(400, 'User Not Found, try again'))
  })

  it('should throw an error if financial registration is not found', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
    vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue(null)

    await expect(
      sut.execute({
        userId: user.id,
        receivableId: receivable.id,
        financialRegistrationId: financialRegistration.id,
      }),
    ).rejects.toThrow(new ErrorHandler(400, 'Financial Not Found, try again'))
  })

  it('should throw an error if receivable is not found', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
    vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue(
      financialRegistration,
    )
    vi.spyOn(financialRepository, 'getReceivableById').mockResolvedValue(null)

    await expect(
      sut.execute({
        userId: user.id,
        receivableId: receivable.id,
        financialRegistrationId: financialRegistration.id,
      }),
    ).rejects.toThrow(new ErrorHandler(400, 'Receivable Not Found, try again'))
  })

  it('should throw an error if user is not the owner of the financial registration', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
    vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue({
      id: 'financial-id-2',
      userId: 'other-user-id',
    })

    await expect(
      sut.execute({
        userId: user.id,
        receivableId: receivable.id,
        financialRegistrationId: financialRegistration.id,
      }),
    ).rejects.toThrow(
      new ErrorHandler(400, 'Unauthorized, Only owner can delete'),
    )
  })
})
