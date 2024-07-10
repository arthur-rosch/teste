import { Notification } from '@prisma/client'


export class SendNotification {
  async send(data: Notification) {
    // io.emit('notification', data)
  }
}
