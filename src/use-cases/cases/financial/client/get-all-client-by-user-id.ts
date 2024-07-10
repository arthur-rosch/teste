import { Client } from '@prisma/client'
import { ErrorHandler } from '../../../../http/middleware/errorResponse'
import { IUserRepository, IFinancialRepository } from '../../../../repository'

interface GetAllClientByUserIdReq {
  userId: string
}

export class GetAllClientByUserIdUseCase {
  constructor(
    private financialRepository: IFinancialRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute({ userId }: GetAllClientByUserIdReq): Promise<Client[]> {
    const userAlreadyExist = await this.userRepository.getUserById(userId)

    if (!userAlreadyExist) {
      throw new ErrorHandler(400, 'User Not Found, try again')
    }

    const financialExists = await this.financialRepository.getFinancial(userId)

    if (!financialExists) {
      throw new ErrorHandler(400, 'Financial Not Found, try again')
    }

    const clients = await this.financialRepository.getAllClientByFinancialId(
      financialExists.id,
    )

    return clients
  }
}
