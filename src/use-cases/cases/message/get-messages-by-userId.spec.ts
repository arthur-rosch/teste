import Chance from "chance";
import { InMemoryMessageRepository } from "@/repository/in-memory/in-memory-message-repository";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ErrorHandler } from "@/http/middleware/errorResponse";
import { GetMessagesByUserId } from "./get-messages-by-userId";

const chance = new Chance();

let messageRepository: InMemoryMessageRepository;
let sut: GetMessagesByUserId;

beforeEach(() => {
  messageRepository = new InMemoryMessageRepository();
  sut = new GetMessagesByUserId(messageRepository);
});

const userId = chance.string({ numeric: true });

const data = {
  id: chance.guid({ version: 4 }),
  content: chance.string(),
  userId,
  chatId: chance.string({ numeric: true }),
  createdAt: chance.date(),
  updatedAt: chance.date(),
};

describe("Get Messages By User Id Test", () => {
  it("should return messages by userId successfully", async () => {
    vi.spyOn(messageRepository, "getUserId").mockResolvedValue({ ...data });

    vi.spyOn(messageRepository, "getMessagesByUserId").mockResolvedValue([
      {
        ...data,
      },
    ]);

    const messages = await sut.execute({ userId });

    expect(messages).toBeDefined();
    expect(messages).toEqual([
      {
        ...data,
      },
    ]);
  });

  it("should return error, userId not exists", async () => {
    vi.spyOn(messageRepository, "getUserId").mockResolvedValue(null);

    await expect(sut.execute({ userId })).rejects.toThrow(
      new ErrorHandler(400, "userId not exists")
    );
  });

  it("should return empty, userId exists but not have messages", async () => {
    vi.spyOn(messageRepository, "getUserId").mockResolvedValue({ ...data });

    vi.spyOn(messageRepository, "getMessagesByUserId").mockResolvedValue([]);

    const messages = await sut.execute({ userId });

    expect(messages).toBeDefined();
  });
});
