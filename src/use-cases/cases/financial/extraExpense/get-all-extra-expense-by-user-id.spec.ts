import { ErrorHandler } from '@/http/middleware/errorResponse'
import { GetAllExtraExpenseByUserIdUseCase } from './get-all-extra-expense-by-user-id'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  InMemoryFinancialRepository,
  InMemoryUserRepository,
} from '@/repository/in-memory'
import { chance } from '@/lib'

let financialRepository: InMemoryFinancialRepository
let userRepository: InMemoryUserRepository
let sut: GetAllExtraExpenseByUserIdUseCase

beforeEach(() => {
  financialRepository = new InMemoryFinancialRepository()
  userRepository = new InMemoryUserRepository()
  sut = new GetAllExtraExpenseByUserIdUseCase(
    financialRepository,
    userRepository,
  )
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
  id: 'financial-id-1',
  userId: user.id,
}

const extraExpenses = [
  {
    id: 'extra-expense-id-1',
    expenseType: 'Business',
    amount: 500,
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-12-31'),
    financialRegistrationId: financialRegistration.id,
  },
  {
    id: 'extra-expense-id-2',
    expenseType: 'Travel',
    amount: 800,
    startDate: new Date('2023-02-01'),
    endDate: new Date('2023-03-31'),
    financialRegistrationId: financialRegistration.id,
  },
]

describe('GetAllExtraExpenseByUserIdUseCase', () => {
  it('should retrieve all extra expenses for a user successfully', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
    vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue(
      financialRegistration,
    )
    vi.spyOn(
      financialRepository,
      'getAllExtraExpenseByFinancialId',
    ).mockResolvedValue(extraExpenses)

    const result = await sut.execute({
      userId: user.id,
    })

    expect(result).toEqual(extraExpenses)
    expect(userRepository.getUserById).toHaveBeenCalledWith(user.id)
    expect(financialRepository.getFinancial).toHaveBeenCalledWith(user.id)
    expect(
      financialRepository.getAllExtraExpenseByFinancialId,
    ).toHaveBeenCalledWith(financialRegistration.id)
  })

  it('should throw an error if user is not found', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(null)

    await expect(
      sut.execute({
        userId: user.id,
      }),
    ).rejects.toThrow(new ErrorHandler(400, 'User Not Found, try again'))
  })

  it('should throw an error if financial registration is not found', async () => {
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user)
    vi.spyOn(financialRepository, 'getFinancial').mockResolvedValue(null)

    await expect(
      sut.execute({
        userId: user.id,
      }),
    ).rejects.toThrow(new ErrorHandler(400, 'Financial Not Found, try again'))
  })
})
