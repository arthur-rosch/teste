import { chance } from '@/lib'
import { DeleteExpenseUseCase } from './delete-expense'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ErrorHandler } from '@/http/middleware/errorResponse'
import {
  InMemoryFinancialRepository,
  InMemoryUserRepository,
} from '@/repository/in-memory'
import { ExpenseType } from '@prisma/client'

let financialRepository: InMemoryFinancialRepository
let userRepository: InMemoryUserRepository
let sut: DeleteExpenseUseCase

beforeEach(() => {
  financialRepository = new InMemoryFinancialRepository()
  userRepository = new InMemoryUserRepository()
  sut = new DeleteExpenseUseCase(financialRepository, userRepository)
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

describe('DeleteExpenseUseCase', () => {
  it('should delete an expense successfully', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
    vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue(
      financialRegistration,
    )
    vi.spyOn(financialRepository, 'getExpenseById').mockResolvedValue(
      expenseData,
    )
    vi.spyOn(financialRepository, 'deleteExpense').mockResolvedValue(
      expenseData,
    )

    const result = await sut.execute({
      userId: user.id,
      expenseId: expenseData.id,
      financialRegistrationId: financialRegistration.id,
    })

    expect(result).toEqual(expenseData)
    expect(userRepository.getUserById).toHaveBeenCalledWith(user.id)
    expect(financialRepository.getFinancial).toHaveBeenCalledWith(
      financialRegistration.id,
    )
    expect(financialRepository.getExpenseById).toHaveBeenCalledWith(
      expenseData.id,
    )
    expect(financialRepository.deleteExpense).toHaveBeenCalledWith(
      expenseData.id,
    )
  })

  it('should throw an error if user is not found', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(null)

    await expect(
      sut.execute({
        userId: user.id,
        expenseId: expenseData.id,
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
        expenseId: expenseData.id,
        financialRegistrationId: financialRegistration.id,
      }),
    ).rejects.toThrow(
      new ErrorHandler(400, 'Unauthorized, Only owner can delete'),
    )
  })

  it('should throw an error if expense is not found', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
    vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue(
      financialRegistration,
    )
    vi.spyOn(financialRepository, 'getExpenseById').mockResolvedValue(null)

    await expect(
      sut.execute({
        userId: user.id,
        expenseId: expenseData.id,
        financialRegistrationId: financialRegistration.id,
      }),
    ).rejects.toThrow(new ErrorHandler(400, 'Expense Not Found, try again'))
  })
})
