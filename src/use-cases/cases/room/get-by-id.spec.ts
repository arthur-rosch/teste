import { Chance } from "chance";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GetRoomByIdUseCase } from "./get-by-id";
import { InMemoryRoomRepository } from "@/repository/in-memory/in-memory-room-repository";
import { ErrorHandler } from "@/http/middleware/errorResponse";

const chance = new Chance();

let roomRepository: InMemoryRoomRepository;
let sut: GetRoomByIdUseCase;

beforeEach(() => {
  roomRepository = new InMemoryRoomRepository();

  sut = new GetRoomByIdUseCase(roomRepository);
});

describe("Get Room By Id Use Case Test", () => {
  const roomId = chance.string({ numeric: true });

  it("should return to the rooms successfully", async () => {
    const room = {
      id: roomId,
      name: chance.string(),
      ownerId: chance.string(),
      updatedAt: chance.date(),
      createdAt: chance.date(),
    };

    vi.spyOn(roomRepository, "getById").mockResolvedValue(room);

    const result = await sut.execute(roomId);

    expect(result).toEqual(room);
    expect(roomRepository.getById).toHaveBeenCalledWith(roomId);
  });

  it("should return error, room does not exist", async () => {
    vi.spyOn(roomRepository, "getById").mockResolvedValue(null);

    await expect(sut.execute(roomId)).rejects.toThrow(
      new ErrorHandler(400, "Room Not Found, try again")
    );
  });
});
