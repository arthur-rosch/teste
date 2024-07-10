import { Client, ClientType } from '@prisma/client'
import { ErrorHandler } from '../../../../http/middleware/errorResponse'
import { IUserRepository, IFinancialRepository } from '../../../../repository'

interface EditClientReq {
  name: string
  phone: string
  email: string
  userId: string
  clientId: string
  address: string
  type: ClientType
  financialRegistrationId: string
}

export class EditClientUseCase {
  constructor(
    private financialRepository: IFinancialRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute({
    address,
    email,
    name,
    phone,
    type,
    userId,
    clientId,
    financialRegistrationId,
  }: EditClientReq): Promise<Client> {
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

    const clientExist = await this.financialRepository.getClientById(clientId)

    if (!clientExist) {
      throw new ErrorHandler(400, 'Client Not Found, try again')
    }

    const client = await this.financialRepository.editClient(clientId, {
      address,
      email,
      name,
      phone,
      type,
      financialRegistrationId,
    })

    return client
  }
}
