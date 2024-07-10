import { io } from '@/index'
import { IMessageRepository } from '@/repository'

interface SendMessageReq {
  content: string
  userId: string
  chatId: string
}

export class SendMessage {
  constructor(private messageRepository: IMessageRepository) {}

  async execute({ chatId, content, userId }: SendMessageReq): Promise<void> {

    io.emit("sendMessage", content);

    await this.messageRepository.saveMessage({
      content,
      userId,
      chatId,
    })
  }
}
