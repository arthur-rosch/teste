import { Client } from '@prisma/client'
import { ErrorHandler } from '@/http/middleware/errorResponse'
import { IUserRepository, IFinancialRepository } from '@/repository'

interface DeleteClientReq {
  userId: string
  clientId: string
  financialRegistrationId: string
}

export class DeleteClientUseCase {
  constructor(
    private financialRepository: IFinancialRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute({
    userId,
    clientId,
    financialRegistrationId,
  }: DeleteClientReq): Promise<Client> {
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

    const clientExist = await this.financialRepository.getClientById(clientId)

    if (!clientExist) {
      throw new ErrorHandler(400, 'Client Not Found, try again')
    }

    const deletedClient = await this.financialRepository.deleteClient(clientId)

    return deletedClient
  }
}
