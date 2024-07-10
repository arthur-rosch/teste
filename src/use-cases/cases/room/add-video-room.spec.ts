import Chance from "chance";
import {
  InMemoryRoomRepository,
  InMemoryUserRepository,
} from "@/repository/in-memory";
import { AddVideoRoomUseCase } from "./add-video-room";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ErrorHandler } from "@/http/middleware/errorResponse";

const chance = new Chance();

let roomRepository: InMemoryRoomRepository;
let userRepository: InMemoryUserRepository;
let sut: AddVideoRoomUseCase;

beforeEach(() => {
  roomRepository = new InMemoryRoomRepository();

  userRepository = new InMemoryUserRepository();

  sut = new AddVideoRoomUseCase(roomRepository, userRepository);
});

const userReturn = {
  id: chance.guid({ version: 4 }),
  name: chance.name(),
  email: chance.email(),
  phone: chance.phone(),
  gender: chance.gender(),
  dateBirth: chance.date().toISOString(),
  password: chance.guid({ version: 4 }),
};

const room = {
  id: chance.string(),
  name: chance.string(),
  ownerId: userReturn.id,
  updatedAt: chance.date(),
  createdAt: chance.date(),
};

const videoRoom = {
  ownerId: userReturn.id,
  roomId: room.id,
  roomLink: chance.word({ length: 10 }),
};

describe("Add Video Room Use Case Test", () => {
  it("should return to the new registered video room", async () => {
    vi.spyOn(userRepository, "getUserById").mockResolvedValue(userReturn);

    vi.spyOn(roomRepository, "getById").mockResolvedValue(room);

    const result = await sut.execute(videoRoom);

    expect(result).toEqual({
      ...videoRoom,
      id: expect.any(String),
    });
    expect(userRepository.getUserById).toHaveBeenCalledWith(userReturn.id);
    expect(roomRepository.getById).toHaveBeenCalledWith(room.id);
  });

  it("should return error, user not found", async () => {
    vi.spyOn(userRepository, "getUserById").mockResolvedValue(null);

    await expect(sut.execute(videoRoom)).rejects.toThrow(
      new ErrorHandler(400, "User Not Found, try again")
    );

    expect(userRepository.getUserById).toHaveBeenCalledWith(userReturn.id)

  });

  it("should return error, room not found", async () => {
    vi.spyOn(userRepository, "getUserById").mockResolvedValue(userReturn);

    vi.spyOn(roomRepository, "getById").mockResolvedValue(null);

    await expect(sut.execute(videoRoom)).rejects.toThrow(
      new ErrorHandler(400, "Room Not Found, try again")
    );
    expect(userRepository.getUserById).toHaveBeenCalledWith(userReturn.id)
    expect(roomRepository.getById).toHaveBeenCalledWith(room.id)

  })
});
