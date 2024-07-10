import { MessageRepository } from '../../../repository/prisma/prisma-message-repository'
import { GetAllMessages } from '../../cases/message/get-all-messages'
import { PrismaClient } from '@prisma/client'

export function makeGetAllMessages() {
  const prisma = new PrismaClient()
  const userRepository = new MessageRepository(prisma)
  const getAllMessages = new GetAllMessages(userRepository)

  return getAllMessages
}
