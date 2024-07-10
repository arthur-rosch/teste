import { Message, Prisma } from '@prisma/client'

export interface IMessageRepository {
  saveMessage(data: Prisma.MessageUncheckedCreateInput): Promise<void>

  getMessagesByChatId(
    data: Pick<Message, 'chatId'>,
  ): Promise<Partial<Message[]> | null>

  getMessagesByUserId(
    data: Pick<Message, 'userId'>,
  ): Promise<Partial<Message[]> | null>

  getAllMessages(): Promise<Message[]>

  getChatId(data: Pick<Message, 'chatId'>): Promise<Message | null>

  getUserId(data: Pick<Message, 'userId'>): Promise<Message | null>
}
