import { Notification } from "@prisma/client";

export interface INotificationRepository {
  create(data: Partial<Notification>): Promise<Notification>;

  getUserId(userId: string): Promise<Notification | null>;
  updateReadyNotification(
    notificationId: string,
    ready: boolean
  ): Promise<void>;
}
