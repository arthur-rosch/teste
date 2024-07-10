import { Notification } from '@prisma/client'
import { io } from '..'

export class SendNotification {
  async send(data: Notification) {
    io.emit('notification', data)
  }
}
