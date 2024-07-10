import { Expense } from '@prisma/client'
import { ErrorHandler } from '../../../../http/middleware/errorResponse'
import { IUserRepository, IFinancialRepository } from '../../../../repository'

interface DeleteExpenseReq {
  userId: string
  expenseId: string
  financialRegistrationId: string
}

export class DeleteExpenseUseCase {
  constructor(
    private financialRepository: IFinancialRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute({
    userId,
    expenseId,
    financialRegistrationId,
  }: DeleteExpenseReq): Promise<Expense> {
    const userAlreadyExist = await this.userRepository.getUserById(userId)

    if (!userAlreadyExist) {
      throw new ErrorHandler(400, 'User Not Found, try again')
    }

    const financialExists = await this.financialRepository.getFinancial(
      financialRegistrationId,
    )

    if (financialExists?.userId !== userId) {
      throw new ErrorHandler(400, 'Unauthorized, Only owner can delete')
    }

    const expenseExist =
      await this.financialRepository.getExpenseById(expenseId)

    if (!expenseExist) {
      throw new ErrorHandler(400, 'Expense Not Found, try again')
    }

    const deletedExpense =
      await this.financialRepository.deleteExpense(expenseId)

    return deletedExpense
  }
}
