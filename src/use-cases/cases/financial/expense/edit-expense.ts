import { Expense, ExpenseType } from '@prisma/client'
import { ErrorHandler } from '../../../../http/middleware/errorResponse'
import { IUserRepository, IFinancialRepository } from '../../../../repository'

interface EditExpenseReq {
  userId: string
  amount: number
  expenseId: string
  type: ExpenseType
  contractEndDate: Date
  recurringMonth: number
  contractStartDate: Date
  financialRegistrationId: string
}

export class EditUseCase {
  constructor(
    private financialRepository: IFinancialRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute({
    type,
    userId,
    amount,
    expenseId,
    recurringMonth,
    contractEndDate,
    contractStartDate,
    financialRegistrationId,
  }: EditExpenseReq): Promise<Expense> {
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

    const expense = await this.financialRepository.editExpense(expenseId, {
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
