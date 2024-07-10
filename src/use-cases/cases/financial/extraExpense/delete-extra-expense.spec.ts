import { ErrorHandler } from '@/http/middleware/errorResponse'
import { DeleteExpenseUseCase } from './delete-extra-expense'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  InMemoryFinancialRepository,
  InMemoryUserRepository,
} from '@/repository/in-memory'
import { chance } from '@/lib'

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

const extraExpenseData = {
  id: 'extra-expense-id-1',
  expenseType: 'Business',
  amount: 500,
  startDate: new Date('2023-01-01'),
  endDate: new Date('2023-12-31'),
  financialRegistrationId: 'financial-id-1',
}

describe('DeleteExpenseUseCase', () => {
  it('should delete an extra expense successfully', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
    vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue({
      id: 'financial-id-1',
      userId: user.id,
    })
    vi.spyOn(financialRepository, 'getExtraExpenseById').mockResolvedValue(
      extraExpenseData,
    )
    vi.spyOn(financialRepository, 'deleteExtraExpense').mockResolvedValue(
      extraExpenseData,
    )

    const result = await sut.execute({
      userId: user.id,
      expenseId: extraExpenseData.id,
      financialRegistrationId: extraExpenseData.financialRegistrationId,
    })

    expect(result).toEqual(extraExpenseData)
    expect(userRepository.getUserById).toHaveBeenCalledWith(user.id)
    expect(financialRepository.getFinancial).toHaveBeenCalledWith(
      extraExpenseData.financialRegistrationId,
    )
    expect(financialRepository.getExtraExpenseById).toHaveBeenCalledWith(
      extraExpenseData.id,
    )
    expect(financialRepository.deleteExtraExpense).toHaveBeenCalledWith(
      extraExpenseData.id,
    )
  })

  it('should throw an error if user is not found', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(null)

    await expect(
      sut.execute({
        userId: user.id,
        expenseId: extraExpenseData.id,
        financialRegistrationId: extraExpenseData.financialRegistrationId,
      }),
    ).rejects.toThrow(new ErrorHandler(400, 'User Not Found, try again'))
  })

  it('should throw an error if financial registration is not found', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
    vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue(null)

    await expect(
      sut.execute({
        userId: user.id,
        expenseId: extraExpenseData.id,
        financialRegistrationId: extraExpenseData.financialRegistrationId,
      }),
    ).rejects.toThrow(
      new ErrorHandler(400, 'Unauthorized, Only owner can delete'),
    )
  })

  it('should throw an error if extra expense is not found', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
    vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue({
      id: 'financial-id-1',
      userId: user.id,
    })
    vi.spyOn(financialRepository, 'getExtraExpenseById').mockResolvedValue(null)

    await expect(
      sut.execute({
        userId: user.id,
        expenseId: extraExpenseData.id,
        financialRegistrationId: extraExpenseData.financialRegistrationId,
      }),
    ).rejects.toThrow(
      new ErrorHandler(400, 'Extra Expense Not Found, try again'),
    )
  })
})
