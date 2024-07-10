import { IRoomRepository } from "../room";
import { Room, Prisma, VideoRoom } from "@prisma/client";

class InMemoryRoomRepository implements IRoomRepository {
  private rooms: { [key: string]: Room } = {};
  private usersInRooms: { [key: string]: Set<string> } = {};
  private videoRooms: VideoRoom[] = [];

  async create(data: Prisma.RoomCreateInput): Promise<Room> {
    const id = (Math.random() * 10000).toFixed(0);
    const createdAt = new Date();
    const updatedAt = createdAt;
    const room: Room = {
      ...data,
      id,
      createdAt,
      updatedAt,
      ownerId: data.owner?.connect?.id || "",
    };

    this.rooms[id] = room;
    this.usersInRooms[id] = new Set();

    return room;
  }

  async getById(roomId: string): Promise<Room | null> {
    return this.rooms[roomId] || null;
  }

  async update(name: string, roomId: string): Promise<void> {
    if (this.rooms[roomId]) {
      this.rooms[roomId].name = name;
    }
  }

  async delete(roomId: string): Promise<void> {
    delete this.rooms[roomId];
    delete this.usersInRooms[roomId];
  }

  async addUserToChat(roomId: string, userId: string): Promise<void> {
    if (this.usersInRooms[roomId]) {
      this.usersInRooms[roomId].add(userId);
    }
  }

  async removeUserFromChat(roomId: string, userId: string): Promise<void> {
    if (this.usersInRooms[roomId]) {
      this.usersInRooms[roomId].delete(userId);
    }
  }

  async createVideoRoom(
    ownerId: string,
    roomId: string,
    roomLink: string
  ): Promise<VideoRoom> {
    const newVideoRoom: VideoRoom = {
      id: (Math.random() * 10000).toFixed(0),
      ownerId,
      roomId,
      roomLink,
    };
    this.videoRooms.push(newVideoRoom);
    return newVideoRoom;
  }
}

export { InMemoryRoomRepository };
