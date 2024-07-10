import { Expense, ExpenseType } from '@prisma/client'
import { ErrorHandler } from '@/http/middleware/errorResponse'
import { IUserRepository, IFinancialRepository } from '@/repository'

interface createExpenseReq {
  userId: string
  amount: number
  type: ExpenseType
  contractEndDate: Date
  recurringMonth: number
  contractStartDate: Date
}

export class CreateUseCase {
  constructor(
    private financialRepository: IFinancialRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute({
    type,
    userId,
    amount,
    recurringMonth,
    contractEndDate,
    contractStartDate,
  }: createExpenseReq): Promise<Expense> {
    const userAlreadyExist = await this.userRepository.getUserById(userId)

    if (!userAlreadyExist) {
      throw new ErrorHandler(400, 'User Not Found, try again')
    }

    let financialExists = await this.financialRepository.getFinancial(userId)

    if (!financialExists) {
      financialExists = await this.financialRepository.createFinancial(userId)
    }

    const expense = await this.financialRepository.createExpenses({
      type,
      amount,
      recurringMonth,
      contractEndDate,
      contractStartDate,
      financialRegistrationId: financialExists.id,
    })

    return expense
  }
}
