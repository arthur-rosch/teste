import { Room, Prisma, VideoRoom } from "@prisma/client";

export interface IRoomRepository {
  delete(roomId: string): Promise<void>;
  update(roomId: string, name: string): Promise<void>;
  create(data: Prisma.RoomUncheckedCreateInput): Promise<Room>;
  getById(roomId: string): Promise<Room | null>;
  addUserToChat(roomId: string, userId: string): Promise<void>;
  removeUserFromChat(roomId: string, userId: string): Promise<void>;
  createVideoRoom(
    ownerId: string,
    roomId: string,
    roomLink: string
  ): Promise<VideoRoom>;
}
