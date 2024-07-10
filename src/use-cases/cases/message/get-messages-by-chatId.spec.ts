import Chance from "chance";
import { InMemoryMessageRepository } from "@/repository/in-memory/in-memory-message-repository";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GetMessagesByChatId } from "./get-messages-by-chatId";
import { ErrorHandler } from "@/http/middleware/errorResponse";

const chance = new Chance();

let messageRepository: InMemoryMessageRepository;
let sut: GetMessagesByChatId;

beforeEach(() => {
  messageRepository = new InMemoryMessageRepository();
  sut = new GetMessagesByChatId(messageRepository);
});

const chatId = chance.string({ numeric: true });

const data = {
  id: chance.guid({ version: 4 }),
  content: chance.string(),
  userId: chance.string({ numeric: true }),
  chatId,
  createdAt: chance.date(),
  updatedAt: chance.date(),
};

describe("Get Messages By ChatId Test", () => {
  it("should return messages by chatId successfully", async () => {
    vi.spyOn(messageRepository, "getChatId").mockResolvedValue({ ...data });

    vi.spyOn(messageRepository, "getMessagesByChatId").mockResolvedValue([
      {
        ...data,
      },
    ]);

    const messages = await sut.execute({ chatId });

    expect(messages).toBeDefined();
    expect(messages).toEqual([
      {
        ...data,
      },
    ]);
  });

  it("should return error, chatId not exists", async () => {
    vi.spyOn(messageRepository, "getChatId").mockResolvedValue(null);

    await expect(sut.execute({ chatId })).rejects.toThrow(
      new ErrorHandler(400, "chatId not exists")
    );
  });

  it("should return empty, chatId exists but not have messages", async () => {
    vi.spyOn(messageRepository, "getChatId").mockResolvedValue({ ...data });

    vi.spyOn(messageRepository, "getMessagesByChatId").mockResolvedValue([]);

    const messages = await sut.execute({ chatId });

    expect(messages).toBeDefined();
  });
});
