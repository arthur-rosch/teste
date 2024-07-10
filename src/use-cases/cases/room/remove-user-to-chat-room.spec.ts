import {
  InMemoryNotificationRepository,
  InMemoryUserRepository,
} from "@/repository/in-memory";
import { InMemoryRoomRepository } from "@/repository/in-memory/in-memory-room-repository";
import Chance from "chance";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ErrorHandler } from "@/http/middleware/errorResponse";
import { RemoveUserToRoomUseCase } from "./remove-user-to-chat-room";
import { SendNotification } from "@/service/sendNotification";

const chance = new Chance();

let notificationRepository: InMemoryNotificationRepository;
let notificationService: SendNotification;
let roomRepository: InMemoryRoomRepository;
let userRepository: InMemoryUserRepository;
let sut: RemoveUserToRoomUseCase;

beforeEach(() => {
  notificationRepository = new InMemoryNotificationRepository();

  notificationService = new SendNotification();

  roomRepository = new InMemoryRoomRepository();

  userRepository = new InMemoryUserRepository();

  sut = new RemoveUserToRoomUseCase(
    notificationRepository,
    notificationService,
    roomRepository,
    userRepository
  );
});

const data = {
  ownerId: chance.string({ numeric: true }),
  userId: chance.string({ numeric: true }),
  roomId: chance.string({ numeric: true }),
};

describe("Remove User to Room Use Case Test", () => {
  const user = {
    id: data.ownerId,
    name: chance.name(),
    email: chance.email(),
    phone: chance.phone(),
    gender: chance.gender(),
    dateBirth: chance.date().toISOString(),
    password: chance.guid({ version: 4 }),
  };

  it("should successfully remove user from room", async () => {
    vi.spyOn(userRepository, "getUserById").mockResolvedValue(user);

    const room = {
      id: chance.string(),
      name: chance.string(),
      ownerId: data.ownerId,
      updatedAt: chance.date(),
      createdAt: chance.date(),
    };

    vi.spyOn(roomRepository, "getById").mockResolvedValue(room);

    const result = await sut.execute(data.roomId, data.userId, data.ownerId);

    expect(result).toBeUndefined();
    expect(roomRepository.getById).toHaveBeenCalledWith(data.roomId);
    expect(userRepository.getUserById).toHaveBeenCalledWith(data.userId);
  });

  it("should return error, owner not found", async () => {
    vi.spyOn(userRepository, "getUserById").mockResolvedValue(null);

    await expect(
      sut.execute(data.roomId, data.userId, data.ownerId)
    ).rejects.toThrow(new ErrorHandler(400, "User Not Found, try again"));
  });

  it("should return error, room not found", async () => {
    vi.spyOn(userRepository, "getUserById").mockResolvedValue(user);

    vi.spyOn(roomRepository, "getById").mockResolvedValue(null);

    await expect(
      sut.execute(data.roomId, data.userId, data.ownerId)
    ).rejects.toThrow(new ErrorHandler(400, "Room Not Found, try again"));
  });

  it("should return error, user removed is not found", async () => {
    vi.spyOn(userRepository, "getUserById")
      .mockImplementationOnce(() => Promise.resolve(user))
      .mockImplementationOnce(() => Promise.resolve(null));

    const room = {
      id: chance.string(),
      name: chance.string(),
      ownerId: data.ownerId,
      updatedAt: chance.date(),
      createdAt: chance.date(),
    };

    vi.spyOn(roomRepository, "getById").mockResolvedValue(room);

    await expect(
      sut.execute(data.roomId, data.userId, data.ownerId)
    ).rejects.toThrow(new ErrorHandler(400, "User Not Found, try again"));
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

    await expect(
      sut.execute(data.roomId, data.userId, data.ownerId)
    ).rejects.toThrow(
      new ErrorHandler(400, "Unauthorized, Only owner can delete the Room")
    );
  });
});
