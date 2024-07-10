import { Receivable } from '@prisma/client'
import { ErrorHandler } from '@/http/middleware/errorResponse'
import { IUserRepository, IFinancialRepository } from '@/repository'

interface DeleteReceivableReq {
  userId: string
  receivableId: string
  financialRegistrationId: string
}

export class DeleteReceivableUseCase {
  constructor(
    private financialRepository: IFinancialRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute({
    userId,
    receivableId,
    financialRegistrationId,
  }: DeleteReceivableReq): Promise<Receivable> {
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

    const receivableExist =
      await this.financialRepository.getReceivableById(receivableId)

    if (!receivableExist) {
      throw new ErrorHandler(400, 'Receivable Not Found, try again')
    }

    const deletedReceivable =
      await this.financialRepository.deleteReceivable(receivableId)

    return deletedReceivable
  }
}
