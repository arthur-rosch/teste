import { ExtraExpense } from '@prisma/client'
import { ErrorHandler } from '../../../../http/middleware/errorResponse'
import { IUserRepository, IFinancialRepository } from '../../../../repository'

interface DeleteExtraExpenseReq {
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
  }: DeleteExtraExpenseReq): Promise<ExtraExpense> {
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

    const extraExpenseExist =
      await this.financialRepository.getExtraExpenseById(expenseId)

    if (!extraExpenseExist) {
      throw new ErrorHandler(400, 'Extra Expense Not Found, try again')
    }

    const deletedExtraExpense =
      await this.financialRepository.deleteExtraExpense(expenseId)

    return deletedExtraExpense
  }
}
