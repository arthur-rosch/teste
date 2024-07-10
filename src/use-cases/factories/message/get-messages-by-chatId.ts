import { MessageRepository } from '../../../repository/prisma/prisma-message-repository'
import { GetMessagesByChatId } from '../../cases/message/get-messages-by-chatId'
import { PrismaClient } from '@prisma/client'

export function makeGetMessagesByChatId() {
  const prisma = new PrismaClient()
  const userRepository = new MessageRepository(prisma)
  const sendMessage = new GetMessagesByChatId(userRepository)

  return sendMessage
}
