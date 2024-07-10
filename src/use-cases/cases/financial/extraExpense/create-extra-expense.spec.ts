import { ErrorHandler } from '@/http/middleware/errorResponse'
import { CreateUseCase } from './create-extra-expense'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  InMemoryFinancialRepository,
  InMemoryUserRepository,
} from '@/repository/in-memory'
import { chance } from '@/lib'

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

const extraExpenseData = {
  id: 'extra-expense-id-1',
  expenseType: 'Business',
  amount: 500,
  startDate: new Date('2023-01-01'),
  endDate: new Date('2023-12-31'),
  financialRegistrationId: 'financial-id-1',
}

describe('CreateUseCase', () => {
  it('should create an extra expense successfully', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
    vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue({
      id: 'financial-id-1',
      userId: user.id,
    })
    vi.spyOn(financialRepository, 'createExtraExpense').mockResolvedValue(
      extraExpenseData,
    )

    const result = await sut.execute({
      userId: user.id,
      amount: extraExpenseData.amount,
      startDate: extraExpenseData.startDate,
      endDate: extraExpenseData.endDate,
      expenseType: extraExpenseData.expenseType,
    })

    expect(result).toEqual(extraExpenseData)
    expect(userRepository.getUserById).toHaveBeenCalledWith(user.id)
    expect(financialRepository.getFinancial).toHaveBeenCalledWith(user.id)
    expect(financialRepository.createExtraExpense).toHaveBeenCalledWith({
      amount: extraExpenseData.amount,
      startDate: extraExpenseData.startDate,
      endDate: extraExpenseData.endDate,
      expenseType: extraExpenseData.expenseType,
      financialRegistrationId: 'financial-id-1', // Adjust as per your test scenario
    })
  })

  it('should throw an error if user is not found', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(null)

    await expect(
      sut.execute({
        userId: user.id,
        amount: extraExpenseData.amount,
        startDate: extraExpenseData.startDate,
        endDate: extraExpenseData.endDate,
        expenseType: extraExpenseData.expenseType,
      }),
    ).rejects.toThrow(new ErrorHandler(400, 'User Not Found, try again'))
  })

  it('should create a financial registration if not found', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
    vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue(null)
    vi.spyOn(financialRepository, 'createFinancial').mockResolvedValue({
      id: 'financial-id-1',
      userId: user.id,
    })
    vi.spyOn(financialRepository, 'createExtraExpense').mockResolvedValue(
      extraExpenseData,
    )

    const result = await sut.execute({
      userId: user.id,
      amount: extraExpenseData.amount,
      startDate: extraExpenseData.startDate,
      endDate: extraExpenseData.endDate,
      expenseType: extraExpenseData.expenseType,
    })

    expect(result).toEqual(extraExpenseData)
    expect(userRepository.getUserById).toHaveBeenCalledWith(user.id)
    expect(financialRepository.getFinancial).toHaveBeenCalledWith(user.id)
    expect(financialRepository.createFinancial).toHaveBeenCalledWith(user.id)
    expect(financialRepository.createExtraExpense).toHaveBeenCalledWith({
      amount: extraExpenseData.amount,
      startDate: extraExpenseData.startDate,
      endDate: extraExpenseData.endDate,
      expenseType: extraExpenseData.expenseType,
      financialRegistrationId: 'financial-id-1', // Adjust as per your test scenario
    })
  })
})
