import Chance from "chance";
import { InMemoryMessageRepository } from "@/repository/in-memory/in-memory-message-repository";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GetAllMessages } from "./get-all-messages";

const chance = new Chance();

let messageRepository: InMemoryMessageRepository;
let sut: GetAllMessages;

beforeEach(() => {
  messageRepository = new InMemoryMessageRepository();
  sut = new GetAllMessages(messageRepository);
});

const data = {
  id: chance.guid({ version: 4 }),
  content: chance.string(),
  userId: chance.string({ numeric: true }),
  chatId: chance.string({ numeric: true }),
  createdAt: chance.date(),
  updatedAt: chance.date(),
};

describe("Get All Messages Test", () => {
  it("should return all messages successfully", async () => {
    vi.spyOn(messageRepository, "getAllMessages").mockResolvedValue([
      {
        ...data,
      },
    ]);

    const messages = await sut.execute();

    expect(messages).toBeDefined();
    expect(messages).toEqual([
      {
        ...data,
      },
    ]);
  });

  it("should return no message", async () => {
    const messages = await sut.execute();

    expect(messages).toBeDefined();
  });
});
