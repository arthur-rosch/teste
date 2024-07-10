import { MessageRepository } from '../../../repository/prisma/prisma-message-repository'
import { SendMessage } from '../../cases/message/send-message'
import { PrismaClient } from '@prisma/client'

export function makeSendMessage() {
  const prisma = new PrismaClient()
  const userRepository = new MessageRepository(prisma)
  const sendMessage = new SendMessage(userRepository)

  return sendMessage
}
