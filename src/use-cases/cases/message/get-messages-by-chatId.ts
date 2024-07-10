import { Message } from "@prisma/client";
import { IMessageRepository } from "@/repository";
import { ErrorHandler } from "@/http/middleware/errorResponse";

export class GetMessagesByChatId {
  constructor(private messageRepository: IMessageRepository) {}

  async execute(
    data: Pick<Message, "chatId">
  ): Promise<Partial<Message[]> | null> {
    const { chatId } = data;

    const chatIdExists = await this.messageRepository.getChatId({ chatId });

    if (!chatIdExists) {
      throw new ErrorHandler(400, "chatId not exists");
    }

    const allMessagesChat = await this.messageRepository.getMessagesByChatId({
      chatId,
    });

    return allMessagesChat;
  }
}
