import { Client, ClientType } from '@prisma/client'
import { ErrorHandler } from '@/http/middleware/errorResponse'
import { IUserRepository, IFinancialRepository } from '@/repository'
interface CreateClientReq {
  name: string
  phone: string
  email: string
  userId: string
  address: string
  type: ClientType
}

export class CreateClientUseCase {
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
  }: CreateClientReq): Promise<Client> {
    const userAlreadyExist = await this.userRepository.getUserById(userId)

    if (!userAlreadyExist) {
      throw new ErrorHandler(400, 'User Not Found, try again')
    }

    let financialExists = await this.financialRepository.getFinancial(userId)

    if (!financialExists) {
      financialExists = await this.financialRepository.createFinancial(userId)
    }

    const client = await this.financialRepository.createClient({
      address,
      email,
      name,
      phone,
      type,
      financialRegistrationId: financialExists.id,
    })

    return client
  }
}
