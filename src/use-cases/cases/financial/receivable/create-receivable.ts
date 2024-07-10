import { Receivable } from '@prisma/client'
import { ErrorHandler } from '../../../../http/middleware/errorResponse'
import { IUserRepository, IFinancialRepository } from '../../../../repository'

interface CreateReceivableReq {
  userId: string
  clientId: string
  serviceProvided: string
  amountToReceive: number
  serviceStartDate: Date
  serviceEndDate: Date
}

export class CreateReceivableUseCase {
  constructor(
    private financialRepository: IFinancialRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute({
    userId,
    clientId,
    amountToReceive,
    serviceEndDate,
    serviceProvided,
    serviceStartDate,
  }: CreateReceivableReq): Promise<Receivable> {
    const userAlreadyExist = await this.userRepository.getUserById(userId)

    if (!userAlreadyExist) {
      throw new ErrorHandler(400, 'User Not Found, try again')
    }

    let financialExists = await this.financialRepository.getFinancial(userId)

    if (!financialExists) {
      financialExists = await this.financialRepository.createFinancial(userId)
    }

    const clientExist = await this.financialRepository.getClientById(clientId)

    if (!clientExist) {
      throw new ErrorHandler(400, 'Client Not Found, try again')
    }

    const receivable = await this.financialRepository.createReceivable({
      amountToReceive,
      serviceEndDate,
      serviceProvided,
      serviceStartDate,
      clientId: clientExist.id,
      financialRegistrationId: financialExists.id,
    })

    return receivable
  }
}
