import { ExtraExpense } from '@prisma/client'
import { ErrorHandler } from '../../../../http/middleware/errorResponse'
import { IUserRepository, IFinancialRepository } from '../../../../repository'

interface GetAllExtraExpenseByUserIdReq {
  userId: string
}

export class GetAllExtraExpenseByUserIdUseCase {
  constructor(
    private financialRepository: IFinancialRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute({
    userId,
  }: GetAllExtraExpenseByUserIdReq): Promise<ExtraExpense[]> {
    const userAlreadyExist = await this.userRepository.getUserById(userId)

    if (!userAlreadyExist) {
      throw new ErrorHandler(400, 'User Not Found, try again')
    }

    const financialExists = await this.financialRepository.getFinancial(userId)

    if (!financialExists) {
      throw new ErrorHandler(400, 'Financial Not Found, try again')
    }

    const extraExpense =
      await this.financialRepository.getAllExtraExpenseByFinancialId(
        financialExists.id,
      )

    return extraExpense
  }
}
