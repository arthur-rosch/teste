import { ExtraExpense } from '@prisma/client'
import { ErrorHandler } from '../../../../http/middleware/errorResponse'
import { IUserRepository, IFinancialRepository } from '../../../../repository'

interface EditExtraExpenseReq {
  userId: string
  amount: number
  endDate: Date
  startDate: Date
  expenseType: string
  extraExpenseId: string
  financialRegistrationId: string
}

export class EditUseCase {
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
    extraExpenseId,
    financialRegistrationId,
  }: EditExtraExpenseReq): Promise<ExtraExpense> {
    const userAlreadyExist = await this.userRepository.getUserById(userId)

    if (!userAlreadyExist) {
      throw new ErrorHandler(400, 'User Not Found, try again')
    }

    const financialExists = await this.financialRepository.getFinancial(
      financialRegistrationId,
    )

    if (financialExists?.userId !== userId) {
      throw new ErrorHandler(400, 'Unauthorized, Only owner can edit')
    }

    const expense = await this.financialRepository.editExtraExpense(
      extraExpenseId,
      {
        amount,
        endDate,
        startDate,
        expenseType,
        financialRegistrationId: financialExists.id,
      },
    )

    return expense
  }
}
