import { ExtraExpense } from '@prisma/client'
import { ErrorHandler } from '../../../../http/middleware/errorResponse'
import { IUserRepository, IFinancialRepository } from '../../../../repository'

interface CreateExtraExpenseReq {
  expenseType: string
  amount: number
  startDate: Date
  endDate: Date
  userId: string
}

export class CreateUseCase {
  constructor(
    private financialRepository: IFinancialRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute({
    userId,
    amount,
    endDate,
    startDate,
    expenseType,
  }: CreateExtraExpenseReq): Promise<ExtraExpense> {
    const userAlreadyExist = await this.userRepository.getUserById(userId)

    if (!userAlreadyExist) {
      throw new ErrorHandler(400, 'User Not Found, try again')
    }

    let financialExists = await this.financialRepository.getFinancial(userId)

    if (!financialExists) {
      financialExists = await this.financialRepository.createFinancial(userId)
    }

    const extraExpense = await this.financialRepository.createExtraExpense({
      amount,
      endDate,
      startDate,
      expenseType,
      financialRegistrationId: financialExists.id,
    })

    return extraExpense
  }
}
