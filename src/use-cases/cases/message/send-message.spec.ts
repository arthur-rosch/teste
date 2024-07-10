import Chance from "chance";
import { InMemoryMessageRepository } from "@/repository/in-memory/in-memory-message-repository";
import { SendMessage } from "./send-message";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { io } from "@/index";

const chance = new Chance();

let messageRepository: InMemoryMessageRepository;
let sut: SendMessage;

beforeEach(() => {
  messageRepository = new InMemoryMessageRepository();
  sut = new SendMessage(messageRepository);
});

const data = {
  content: chance.string(),
  userId: chance.string({ numeric: true }),
  chatId: chance.string({ numeric: true }),
};

describe("Send Message Test", () => {
  it("should send and save message with successfully", async () => {
    const result = await sut.execute({
      content: data.content,
      chatId: data.chatId,
      userId: data.userId,
    });

    expect(result).toBeUndefined();
  });
});
