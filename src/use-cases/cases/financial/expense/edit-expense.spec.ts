import { chance } from '@/lib'
import { EditUseCase } from './edit-expense'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ErrorHandler } from '@/http/middleware/errorResponse'
import {
  InMemoryFinancialRepository,
  InMemoryUserRepository,
} from '@/repository/in-memory'
import { ExpenseType } from '@prisma/client'

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

describe('EditExpenseUseCase', () => {
  it('should edit an expense successfully', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
    vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue(
      financialRegistration,
    )
    vi.spyOn(financialRepository, 'editExpense').mockResolvedValue(expenseData)

    const editedExpenseData = {
      ...expenseData,
      type: ExpenseType.SUPPLIER,
      amount: 1200,
      recurringMonth: 6,
    }

    const result = await sut.execute({
      ...expenseData,
      expenseId: expenseData.id,
      userId: user.id,
    })

    expect(result).toEqual(editedExpenseData)
    expect(userRepository.getUserById).toHaveBeenCalledWith(user.id)
    expect(financialRepository.getFinancial).toHaveBeenCalledWith(
      financialRegistration.id,
    )
    expect(financialRepository.editExpense).toHaveBeenCalledWith(
      expenseData.id,
      {
        type: editedExpenseData.type,
        amount: editedExpenseData.amount,
        recurringMonth: editedExpenseData.recurringMonth,
        contractEndDate: editedExpenseData.contractEndDate,
        contractStartDate: editedExpenseData.contractStartDate,
        financialRegistrationId: financialRegistration.id,
      },
    )
  })

  it('should throw an error if user is not found', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(null)

    await expect(
      sut.execute({
        userId: user.id,
        expenseId: expenseData.id,
        type: ExpenseType.SUPPLIER,
        amount: 1200,
        recurringMonth: 6,
        contractEndDate: chance.date(),
        contractStartDate: chance.date(),
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
        type: ExpenseType.SUPPLIER,
        amount: 1200,
        recurringMonth: 6,
        contractEndDate: chance.date(),
        contractStartDate: chance.date(),
        financialRegistrationId: financialRegistration.id,
      }),
    ).rejects.toThrow(
      new ErrorHandler(400, 'Unauthorized, Only owner can edit'),
    )
  })

  // it('should throw an error if expense is not found', async () => {
  //   vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
  //   vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue(
  //     financialRegistration,
  //   )
  //   vi.spyOn(financialRepository, 'editExpense').mockResolvedValue(null)

  //   await expect(
  //     sut.execute({
  //       userId: user.id,
  //       expenseId: expenseData.id,
  //       type: ExpenseType.SUPPLIER,
  //       amount: 1200,
  //       recurringMonth: 6,
  //       contractEndDate: chance.date(),
  //       contractStartDate: chance.date(),
  //       financialRegistrationId: financialRegistration.id,
  //     }),
  //   ).rejects.toThrow(new ErrorHandler(400, 'Expense Not Found, try again'))
  // })
})
