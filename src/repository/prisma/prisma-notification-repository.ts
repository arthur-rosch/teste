import { Notification, PrismaClient } from "@prisma/client";
import { INotificationRepository } from "../notification";

export class NotificationRepository implements INotificationRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: Notification): Promise<Notification> {
    return await this.prisma.notification.create({ data });
  }

  async getUserId(userId: string): Promise<Notification | null> {
    return await this.prisma.notification.findFirst({
      where: {
        userId: userId,
      },
    });
  }

  async updateReadyNotification(
    notificationId: string,
    ready: boolean
  ): Promise<void> {
    await this.prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: ready,
      },
    });
  }
}
