import { Receivable } from '@prisma/client'
import { ErrorHandler } from '@/http/middleware/errorResponse'
import { IUserRepository, IFinancialRepository } from '@/repository'

interface EditReceivableReq {
  userId: string
  clientId: string
  serviceProvided: string
  amountToReceive: number
  serviceStartDate: Date
  serviceEndDate: Date
  receivableId: string
}

export class EditReceivableUseCase {
  constructor(
    private financialRepository: IFinancialRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute({
    userId,
    clientId,
    receivableId,
    amountToReceive,
    serviceEndDate,
    serviceProvided,
    serviceStartDate,
  }: EditReceivableReq): Promise<Receivable> {
    const userAlreadyExist = await this.userRepository.getUserById(userId)

    if (!userAlreadyExist) {
      throw new ErrorHandler(400, 'User Not Found, try again')
    }

    const financialExists = await this.financialRepository.getFinancial(userId)

    if (financialExists?.userId !== userId) {
      throw new ErrorHandler(400, 'Unauthorized, Only owner can edit')
    }

    const clientExist = await this.financialRepository.getClientById(clientId)

    if (!clientExist) {
      throw new ErrorHandler(400, 'Client Not Found, try again')
    }

    const receivable = await this.financialRepository.editReceivable(
      receivableId,
      {
        amountToReceive,
        serviceEndDate,
        serviceProvided,
        serviceStartDate,
        clientId: clientExist.id,
        financialRegistrationId: financialExists.id,
      },
    )

    return receivable
  }
}
