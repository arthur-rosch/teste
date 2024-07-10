import { Message, Prisma, PrismaClient } from '@prisma/client'
import { IMessageRepository } from '../message'

export class MessageRepository implements IMessageRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async saveMessage(data: Prisma.MessageUncheckedCreateInput): Promise<void> {
    const { content, userId, chatId } = data as Message

    await this.prisma.message.create({
      data: {
        content,
        userId,
        chatId,
      },
    })
  }

  async getMessagesByChatId(
    data: Pick<Message, 'chatId'>,
  ): Promise<Partial<Message[]> | null> {
    const searchMessage = await this.prisma.message.findMany({
      where: {
        chatId: data.chatId,
      },
    })

    return searchMessage
  }

  async getMessagesByUserId(
    data: Pick<Message, 'userId'>,
  ): Promise<Partial<Message[]> | null> {
    const searchMessage = await this.prisma.message.findMany({
      where: {
        userId: data.userId,
      },
    })

    return searchMessage
  }

  async getAllMessages(): Promise<Message[]> {
    const allMessages = await this.prisma.message.findMany()

    return allMessages
  }

  async getChatId(data: Pick<Message, 'chatId'>): Promise<Message | null> {
    const getChatId = await this.prisma.message.findFirst({
      where: {
        chatId: data.chatId,
      },
    })

    return getChatId
  }

  async getUserId(data: Pick<Message, 'userId'>): Promise<Message | null> {
    const getUserId = await this.prisma.message.findFirst({
      where: {
        userId: data.userId,
      },
    })

    return getUserId
  }
}
