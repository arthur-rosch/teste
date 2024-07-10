import Chance from "chance";
import { ErrorHandler } from "@/http/middleware/errorResponse";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Prisma, Room } from "@prisma/client";
import { CreateRoomUseCase } from "./create";
import { InMemoryRoomRepository } from "@/repository/in-memory/in-memory-room-repository";
import {
  InMemoryNotificationRepository,
  InMemoryUserRepository,
} from "@/repository/in-memory";
import { InMemoryChatRepository } from "@/repository/in-memory/in-memory-chat-repository";
import { SendNotification } from "@/service/sendNotification";

const chance = new Chance();

let notificationRepository: InMemoryNotificationRepository;
let notificationService: SendNotification;
let roomRepository: InMemoryRoomRepository;
let userRepository: InMemoryUserRepository;
let chatRepository: InMemoryChatRepository;
let sut: CreateRoomUseCase;

beforeEach(() => {
  notificationRepository = new InMemoryNotificationRepository();

  notificationService = new SendNotification();

  roomRepository = new InMemoryRoomRepository();

  userRepository = new InMemoryUserRepository();

  chatRepository = new InMemoryChatRepository();

  sut = new CreateRoomUseCase(
    notificationRepository,
    notificationService,
    roomRepository,
    userRepository,
    chatRepository
  );
});

const data = {
  name: chance.string(),
  ownerId: chance.guid({ version: 4 }),
};

describe("Create Room Use Case Test", () => {
  it("should return a new room when created successfully", async () => {
    const user = {
      id: data.ownerId,
      name: chance.name(),
      email: chance.email(),
      phone: chance.phone(),
      gender: chance.gender(),
      dateBirth: chance.date().toISOString(),
      password: chance.guid({ version: 4 }),
    };

    const createdRoom: Room = {
      id: chance.guid({ version: 4 }),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.spyOn(userRepository, "getUserById").mockResolvedValue(user);
    vi.spyOn(roomRepository, "create").mockResolvedValue(createdRoom);
    vi.spyOn(chatRepository, "create").mockResolvedValue({
      id: createdRoom.id,
      roomId: createdRoom.id,
      createdAt: createdRoom.createdAt,
      updatedAt: createdRoom.createdAt,
    });

    const room = await sut.execute(data);

    expect(room).toEqual(createdRoom);
    expect(roomRepository.create).toHaveBeenCalledWith(data);
    expect(chatRepository.create).toHaveBeenCalledWith({
      roomId: createdRoom.id,
    });
  });

  it("should return an error if the owner does not exist", async () => {
    vi.spyOn(userRepository, "getUserById").mockResolvedValue(null);

    await expect(sut.execute(data)).rejects.toThrow(
      new ErrorHandler(400, "User Not Found, try again")
    );
  });
});
