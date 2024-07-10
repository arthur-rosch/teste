import { ErrorHandler } from "../../../http/middleware/errorResponse";
import { IMessageRepository } from "../../../repository";
import { Message } from "@prisma/client";

export class GetMessagesByUserId {
  constructor(private messageRepository: IMessageRepository) {}

  async execute(
    data: Pick<Message, "userId">
  ): Promise<Partial<Message[]> | null> {
    const { userId } = data;

    const userIdExists = await this.messageRepository.getUserId({ userId });

    if (!userIdExists) {
      throw new ErrorHandler(400, "userId not exists");
    }

    const allMessagesChat = await this.messageRepository.getMessagesByUserId({
      userId,
    });

    return allMessagesChat;
  }
}
