import { Receivable } from '@prisma/client'
import { ErrorHandler } from '../../../../http/middleware/errorResponse'
import { IUserRepository, IFinancialRepository } from '../../../../repository'

interface GetAllReceivableByUserIdReq {
  userId: string
}

export class GetAllReceivableByUserIdUseCase {
  constructor(
    private financialRepository: IFinancialRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute({
    userId,
  }: GetAllReceivableByUserIdReq): Promise<Receivable[]> {
    const userAlreadyExist = await this.userRepository.getUserById(userId)

    if (!userAlreadyExist) {
      throw new ErrorHandler(400, 'User Not Found, try again')
    }

    const financialExists = await this.financialRepository.getFinancial(userId)

    if (!financialExists) {
      throw new ErrorHandler(400, 'Financial Not Found, try again')
    }

    const receivables =
      await this.financialRepository.getAllReceivableByFinancialId(
        financialExists.id,
      )

    return receivables
  }
}
