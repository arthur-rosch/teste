import { ErrorHandler } from '@/http/middleware/errorResponse'
import { EditUseCase } from './edit-extra-expense'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  InMemoryFinancialRepository,
  InMemoryUserRepository,
} from '@/repository/in-memory'
import { chance } from '@/lib'

let financialRepository: InMemoryFinancialRepository
let userRepository: InMemoryUserRepository
let sut: EditUseCase

beforeEach(() => {
  financialRepository = new InMemoryFinancialRepository()
  userRepository = new InMemoryUserRepository()
  sut = new EditUseCase(financialRepository, userRepository)
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

describe('EditUseCase', () => {
  it('should edit an extra expense successfully', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
    vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue({
      id: 'financial-id-1',
      userId: user.id,
    })
    vi.spyOn(financialRepository, 'editExtraExpense').mockResolvedValue(
      extraExpenseData,
    )

    const editedExtraExpenseData = {
      ...extraExpenseData,
      amount: 800,
      expenseType: 'Travel',
    }

    const result = await sut.execute({
      userId: user.id,
      extraExpenseId: extraExpenseData.id,
      amount: editedExtraExpenseData.amount,
      endDate: editedExtraExpenseData.endDate,
      startDate: editedExtraExpenseData.startDate,
      expenseType: editedExtraExpenseData.expenseType,
      financialRegistrationId: extraExpenseData.financialRegistrationId,
    })

    expect(result).toEqual(editedExtraExpenseData)
    expect(userRepository.getUserById).toHaveBeenCalledWith(user.id)
    expect(financialRepository.getFinancial).toHaveBeenCalledWith(
      extraExpenseData.financialRegistrationId,
    )
    expect(financialRepository.editExtraExpense).toHaveBeenCalledWith(
      extraExpenseData.id,
      {
        amount: editedExtraExpenseData.amount,
        endDate: editedExtraExpenseData.endDate,
        startDate: editedExtraExpenseData.startDate,
        expenseType: editedExtraExpenseData.expenseType,
        financialRegistrationId: extraExpenseData.financialRegistrationId,
      },
    )
  })

  it('should throw an error if user is not found', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(null)

    await expect(
      sut.execute({
        userId: user.id,
        extraExpenseId: extraExpenseData.id,
        amount: 800,
        endDate: new Date('2023-12-31'),
        startDate: new Date('2023-01-01'),
        expenseType: 'Travel',
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
        extraExpenseId: extraExpenseData.id,
        amount: 800,
        endDate: new Date('2023-12-31'),
        startDate: new Date('2023-01-01'),
        expenseType: 'Travel',
        financialRegistrationId: extraExpenseData.financialRegistrationId,
      }),
    ).rejects.toThrow(
      new ErrorHandler(400, 'Unauthorized, Only owner can edit'),
    )
  })

  // it('should throw an error if extra expense is not found', async () => {
  //   vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
  //   vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue({
  //     id: 'financial-id-1',
  //     userId: user.id,
  //   })
  //   vi.spyOn(financialRepository, 'editExtraExpense').mockResolvedValue(null)

  //   await expect(
  //     sut.execute({
  //       userId: user.id,
  //       extraExpenseId: extraExpenseData.id,
  //       amount: 800,
  //       endDate: new Date('2023-12-31'),
  //       startDate: new Date('2023-01-01'),
  //       expenseType: 'Travel',
  //       financialRegistrationId: extraExpenseData.financialRegistrationId,
  //     }),
  //   ).rejects.toThrow(
  //     new ErrorHandler(400, 'Extra Expense Not Found, try again'),
  //   )
  // })
})
