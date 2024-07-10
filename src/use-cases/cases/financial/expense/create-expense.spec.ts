import { chance } from '@/lib'
import { ExpenseType } from '@prisma/client'
import { CreateUseCase } from './create-expense'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ErrorHandler } from '@/http/middleware/errorResponse'
import {
  InMemoryFinancialRepository,
  InMemoryUserRepository,
} from '@/repository/in-memory'

let financialRepository: InMemoryFinancialRepository
let userRepository: InMemoryUserRepository
let sut: CreateUseCase

beforeEach(() => {
  financialRepository = new InMemoryFinancialRepository()
  userRepository = new InMemoryUserRepository()
  sut = new CreateUseCase(financialRepository, userRepository)
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

const expenseData = {
  id: chance.guid({ version: 4 }),
  type: ExpenseType.SERVICE_PROVIDER,
  amount: chance.floating({ min: 100, max: 1000 }),
  recurringMonth: chance.integer({ min: 1, max: 12 }),
  contractEndDate: chance.date(),
  contractStartDate: chance.date(),
  financialRegistrationId: financialRegistration.id,
}

describe('CreateUseCase', () => {
  it('should create an expense successfully', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
    vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue(null)
    vi.spyOn(financialRepository, 'createFinancial').mockResolvedValue(
      financialRegistration,
    )
    vi.spyOn(financialRepository, 'createExpenses').mockResolvedValue(
      expenseData,
    )

    const result = await sut.execute({
      userId: user.id,
      type: expenseData.type,
      amount: expenseData.amount,
      recurringMonth: expenseData.recurringMonth,
      contractEndDate: expenseData.contractEndDate,
      contractStartDate: expenseData.contractStartDate,
    })

    expect(result).toEqual({
      ...expenseData,
    })
    expect(userRepository.getUserById).toHaveBeenCalledWith(user.id)
    expect(financialRepository.getFinancial).toHaveBeenCalledWith(user.id)
    expect(financialRepository.createFinancial).toHaveBeenCalledWith(user.id)
    expect(financialRepository.createExpenses).toHaveBeenCalledWith({
      type: expenseData.type,
      amount: expenseData.amount,
      recurringMonth: expenseData.recurringMonth,
      contractEndDate: expenseData.contractEndDate,
      contractStartDate: expenseData.contractStartDate,
      financialRegistrationId: financialRegistration.id,
    })
  })

  it('should throw an error if user is not found', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(null)

    await expect(
      sut.execute({
        userId: user.id,
        type: expenseData.type,
        amount: expenseData.amount,
        recurringMonth: expenseData.recurringMonth,
        contractEndDate: expenseData.contractEndDate,
        contractStartDate: expenseData.contractStartDate,
      }),
    ).rejects.toThrow(new ErrorHandler(400, 'User Not Found, try again'))
  })

  it('should throw an error if financial registration is not found', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
    vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue(null)
    vi.spyOn(financialRepository, 'createFinancial').mockResolvedValue(
      financialRegistration,
    )

    const result = await sut.execute({
      userId: user.id,
      type: expenseData.type,
      amount: expenseData.amount,
      recurringMonth: expenseData.recurringMonth,
      contractEndDate: expenseData.contractEndDate,
      contractStartDate: expenseData.contractStartDate,
    })

    expect(result).toEqual(expenseData)
    expect(userRepository.getUserById).toHaveBeenCalledWith(user.id)
    expect(financialRepository.getFinancial).toHaveBeenCalledWith(user.id)
    expect(financialRepository.createFinancial).toHaveBeenCalledWith(user.id)
    expect(financialRepository.createExpenses).toHaveBeenCalledWith({
      type: expenseData.type,
      amount: expenseData.amount,
      recurringMonth: expenseData.recurringMonth,
      contractEndDate: expenseData.contractEndDate,
      contractStartDate: expenseData.contractStartDate,
      financialRegistrationId: financialRegistration.id,
    })
  })
})
