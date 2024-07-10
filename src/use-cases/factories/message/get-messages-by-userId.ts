import { MessageRepository } from '../../../repository/prisma/prisma-message-repository'
import { GetMessagesByUserId } from '../../cases/message/get-messages-by-userId'
import { PrismaClient } from '@prisma/client'

export function makeGetMessagesByUserId() {
  const prisma = new PrismaClient()
  const userRepository = new MessageRepository(prisma)
  const sendMessage = new GetMessagesByUserId(userRepository)

  return sendMessage
}
