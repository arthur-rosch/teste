import { INotificationRepository } from "../notification";
import { Notification } from "@prisma/client";

export class InMemoryNotificationRepository implements INotificationRepository {
  private notifications: Notification[];

  constructor() {
    this.notifications = [];
  }

  async create(data: Notification): Promise<Notification> {
    const newNotification = {
      ...data,
      id: (this.notifications.length + 1).toString(),
    };
    this.notifications.push(newNotification);
    return newNotification;
  }

  async getUserId(userId: string): Promise<Notification | null> {
    return (
      this.notifications.find(
        (notification) => notification.userId === userId
      ) || null
    );
  }

  async updateReadyNotification(
    notificationId: string,
    ready: boolean
  ): Promise<void> {
    const notification = this.notifications.find(
      (notification) => notification.id === notificationId
    );

    notification!.isRead = ready;
  }
}
