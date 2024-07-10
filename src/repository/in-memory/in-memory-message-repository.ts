import { Message } from '@prisma/client';
import { IMessageRepository } from '../message';

export class InMemoryMessageRepository implements IMessageRepository {
  private messages: Message[] = [];
  private idCounter: number = 1;

  async saveMessage(data: Message): Promise<void> {
    const newMessage: Message = {
      ...data,
      id: this.idCounter.toString(),
    };

    this.messages.push(newMessage)
    this.idCounter++;
  }

  async getMessagesByChatId(data: Pick<Message, 'chatId'>): Promise<Message[]> {
    const messages = this.messages.filter((msg) => msg.chatId === data.chatId);
    return messages;
  }

  async getMessagesByUserId(data: Pick<Message, 'userId'>): Promise<Message[]> {
    const messages = this.messages.filter((msg) => msg.userId === data.userId);
    return messages;
  }

  async getAllMessages(): Promise<Message[]> {
    return this.messages;
  }

  async getChatId(data: Pick<Message, 'chatId'>): Promise<Message | null> {
    const message = this.messages.find((msg) => msg.chatId === data.chatId);
    return message || null;
  }

  async getUserId(data: Pick<Message, 'userId'>): Promise<Message | null> {
    const message = this.messages.find((msg) => msg.userId === data.userId);
    return message || null;
  }
}
