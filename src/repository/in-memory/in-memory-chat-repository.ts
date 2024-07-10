import { IChatRepository } from "../chat";
import { Chat, Prisma } from "@prisma/client";

class InMemoryChatRepository implements IChatRepository {
  private chats: { [key: string]: Chat } = {};

  async delete(chatId: string): Promise<void> {
    delete this.chats[chatId];
  }

  async create(data: Prisma.ChatUncheckedCreateInput): Promise<Chat> {
    const id = (Math.random() * 10000).toFixed(0);
    const createdAt = new Date();
    const updatedAt = createdAt;
    const chat: Chat = { ...data, id, createdAt, updatedAt };

    this.chats[id] = chat;
    return chat;
  }

  async getById(id: string): Promise<Chat | null> {
    return this.chats[id] || null;
  }

  async getByRoomId(chatRoomId: string): Promise<Chat | null> {
    const chat = Object.values(this.chats).find(
      (chat) => chat.roomId === chatRoomId
    );
    return chat || null;
  }
}

export { InMemoryChatRepository };
