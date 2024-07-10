import { IMessageRepository } from '../../../repository'

export class GetAllMessages {
  constructor(private messageRepository: IMessageRepository) {}

  async execute() {
    const allMessages = await this.messageRepository.getAllMessages()

    return allMessages
  }
}
