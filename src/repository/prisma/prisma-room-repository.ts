import { IRoomRepository } from "../room";
import { Room, Prisma, PrismaClient, VideoRoom } from "@prisma/client";

export class RoomRepository implements IRoomRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: Prisma.RoomCreateInput): Promise<Room> {
    const createRoom = await this.prisma.room.create({
      data,
    });

    return createRoom;
  }

  async getById(roomId: string): Promise<Room | null> {
    const room = await this.prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });

    return room;
  }

  async update(name: string, roomId: string): Promise<void> {
    await this.prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        name: name,
      },
    });
  }

  async delete(roomId: string): Promise<void> {
    await this.prisma.room.delete({
      where: {
        id: roomId,
      },
    });
  }

  async addUserToChat(roomId: string, userId: string): Promise<void> {
    await this.prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        users: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async removeUserFromChat(roomId: string, userId: string): Promise<void> {
    await this.prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        users: {
          disconnect: {
            id: userId,
          },
        },
      },
    });
  }

  async createVideoRoom(
    ownerId: string,
    roomId: string,
    roomLink: string
  ): Promise<VideoRoom> {
    return await this.prisma.videoRoom.create({
      data: {
        ownerId,
        roomId,
        roomLink,
      },
    });
  }
}
