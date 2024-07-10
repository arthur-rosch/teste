import {
  InMemoryNotificationRepository,
  InMemoryUserRepository,
} from "@/repository/in-memory";
import { InMemoryRoomRepository } from "@/repository/in-memory/in-memory-room-repository";
import Chance from "chance";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DeleteRoomUseCase } from "./delete";
import { ErrorHandler } from "@/http/middleware/errorResponse";
import { InMemoryChatRepository } from "@/repository/in-memory/in-memory-chat-repository";
import { Chat } from "@prisma/client";
import { SendNotification } from "@/service/sendNotification";

const chance = new Chance();

let notificationRepository: InMemoryNotificationRepository;
let notificationService: SendNotification;
let chatRepository: InMemoryChatRepository;
let roomRepository: InMemoryRoomRepository;
let userRepository: InMemoryUserRepository;
let sut: DeleteRoomUseCase;

beforeEach(() => {
  notificationRepository = new InMemoryNotificationRepository();

  notificationService = new SendNotification();

  chatRepository = new InMemoryChatRepository();

  roomRepository = new InMemoryRoomRepository();

  userRepository = new InMemoryUserRepository();

  sut = new DeleteRoomUseCase(
    notificationRepository,
    notificationService,
    chatRepository,
    roomRepository,
    userRepository
  );
});

const data = {
  owner: chance.string(),
  userId: chance.string({ numeric: true }),
  roomId: chance.string({ numeric: true }),
};

const user = {
  id: data.owner,
  name: chance.name(),
  email: chance.email(),
  phone: chance.phone(),
  gender: chance.gender(),
  dateBirth: chance.date().toISOString(),
  password: chance.guid({ version: 4 }),
};

describe("Delete Room Use Case Test", () => {
  it("should delete a room successfully", async () => {
    vi.spyOn(userRepository, "getUserById").mockResolvedValue(user);

    const room = {
      id: chance.string(),
      name: chance.string(),
      ownerId: data.owner,
      updatedAt: chance.date(),
      createdAt: chance.date(),
    };

    vi.spyOn(roomRepository, "getById").mockResolvedValue(room);

    const chat = {
      id: chance.guid({ version: 4 }),
    } as Chat;

    vi.spyOn(chatRepository, "getByRoomId").mockResolvedValue(chat);

    const result = await sut.execute(data.roomId, data.userId);

    expect(result).toBeUndefined();
    expect(roomRepository.getById).toHaveBeenCalledWith(data.roomId);
    expect(userRepository.getUserById).toHaveBeenCalledWith(data.userId);
  });

  it("should return error, user not found", async () => {
    vi.spyOn(userRepository, "getUserById").mockResolvedValue(null);

    await expect(sut.execute(data.roomId, data.userId)).rejects.toThrow(
      new ErrorHandler(400, "User Not Found, try again")
    );
  });

  it("should return error, room not found", async () => {
    vi.spyOn(userRepository, "getUserById").mockResolvedValue(user);

    vi.spyOn(roomRepository, "getById").mockResolvedValue(null);

    await expect(sut.execute(data.roomId, data.userId)).rejects.toThrow(
      new ErrorHandler(400, "Room Not Found, try again")
    );
  });

  it("should return error, unauthorized user", async () => {
    vi.spyOn(userRepository, "getUserById").mockResolvedValue(user);

    const room = {
      id: chance.string(),
      name: chance.string(),
      ownerId: chance.string(),
      updatedAt: chance.date(),
      createdAt: chance.date(),
    };

    vi.spyOn(roomRepository, "getById").mockResolvedValue(room);

    await expect(sut.execute(data.roomId, data.userId)).rejects.toThrow(
      new ErrorHandler(400, "Unauthorized, Only owner can delete the Room")
    );
  });
});
