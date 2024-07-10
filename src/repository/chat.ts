import { Chat, Prisma } from '@prisma/client'

export interface IChatRepository {
  delete(chatRoomId: string): Promise<void>
  getById(chatRoomId: string): Promise<Chat | null>
  getByRoomId(chatRoomId: string): Promise<Chat | null>
  create(data: Prisma.ChatUncheckedCreateInput): Promise<Chat>
}
