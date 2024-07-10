import { Expense } from '@prisma/client'
import { ErrorHandler } from '@/http/middleware/errorResponse'
import { GetAllExpenseByUserIdUseCase } from './get-all-expense-by-user-id'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  InMemoryFinancialRepository,
  InMemoryUserRepository,
} from '@/repository/in-memory'
import { chance } from '@/lib'

let financialRepository: InMemoryFinancialRepository
let userRepository: InMemoryUserRepository
let sut: GetAllExpenseByUserIdUseCase

beforeEach(() => {
  financialRepository = new InMemoryFinancialRepository()
  userRepository = new InMemoryUserRepository()
  sut = new GetAllExpenseByUserIdUseCase(financialRepository, userRepository)
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

const expenses: Expense[] = [
  {
    id: 'expense-id-1',
    type: 'SERVICE_PROVIDER',
    amount: 500,
    recurringMonth: 12,
    contractStartDate: new Date('2023-01-01'),
    contractEndDate: new Date('2023-12-31'),
    financialRegistrationId: financialRegistration.id,
  },
  {
    id: 'expense-id-2',
    type: 'SUPPLIER',
    amount: 800,
    recurringMonth: 6,
    contractStartDate: new Date('2023-02-01'),
    contractEndDate: new Date('2023-07-31'),
    financialRegistrationId: financialRegistration.id,
  },
]

describe('GetAllExpenseByUserIdUseCase', () => {
  it('should retrieve all expenses for a user successfully', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
    vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue(
      financialRegistration,
    )
    vi.spyOn(
      financialRepository,
      'getAllExpenseByFinancialId',
    ).mockResolvedValue(expenses)

    const result = await sut.execute({ userId: user.id })

    expect(result).toEqual(expenses)
    expect(userRepository.getUserById).toHaveBeenCalledWith(user.id)
    expect(financialRepository.getFinancial).toHaveBeenCalledWith(
      financialRegistration.userId,
    )
    expect(financialRepository.getAllExpenseByFinancialId).toHaveBeenCalledWith(
      financialRegistration.id,
    )
  })

  it('should throw an error if user is not found', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(null)

    await expect(sut.execute({ userId: user.id })).rejects.toThrow(
      new ErrorHandler(400, 'User Not Found, try again'),
    )
  })

  it('should throw an error if financial registration is not found', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
    vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue(null)

    await expect(sut.execute({ userId: user.id })).rejects.toThrow(
      new ErrorHandler(400, 'Financial Not Found, try again'),
    )
  })
})
