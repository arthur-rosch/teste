import { IChatRepository } from '../chat'
import { Chat, Prisma, PrismaClient } from '@prisma/client'

export class ChatRepository implements IChatRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async delete(chatId: string): Promise<void> {
    await this.prisma.chat.delete({
      where: {
        id: chatId,
      },
    })
  }

  async create(data: Prisma.ChatUncheckedCreateInput): Promise<Chat> {
    const createChat = await this.prisma.chat.create({
      data,
    })

    return createChat
  }

  async getById(id: string): Promise<Chat | null> {
    const chat = await this.prisma.chat.findFirst({
      where: {
        id,
      },
    })

    return chat
  }

  async getByRoomId(chatRoomId: string): Promise<Chat | null> {
    const chatRoom = await this.prisma.chat.findFirst({
      where: {
        roomId: chatRoomId,
      },
    })

    return chatRoom
  }
}
