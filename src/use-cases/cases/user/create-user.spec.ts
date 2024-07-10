import Chance from "chance";
import { CreateUser } from "./create-user";
import { ErrorHandler } from "@/http/middleware/errorResponse";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryUserRepository } from "@/repository/in-memory";
import { SendEmailToken } from "@/service/sendEmail";
import { InMemoryEmailTokenRepository } from "@/repository/in-memory/in-memory-emailToken-repository";

const chance = new Chance();

let emailService: SendEmailToken;
let emailRepository: InMemoryEmailTokenRepository;
let userRepository: InMemoryUserRepository;
let sut: CreateUser;

beforeEach(() => {
  (userRepository = new InMemoryUserRepository()),
    (emailService = new SendEmailToken()),
    (emailRepository = new InMemoryEmailTokenRepository()),
    (sut = new CreateUser(userRepository, emailService, emailRepository));
});

const password = chance.string({ numeric: true, length: 6 });

const data = {
  name: chance.name(),
  email: chance.email(),
  phone: chance.phone(),
  gender: chance.gender(),
  dateBirth: chance.date().toISOString(),
  password,
  confirmPassword: password,
};

describe("Create User Test", () => {
  it("should return a new user when registered", async () => {
    const { user } = await sut.execute(data);

    expect(user).toEqual({
      id: expect.any(String),
      name: data.name,
      email: data.email,
      phone: data.phone,
      gender: data.gender,
      dateBirth: data.dateBirth,
      password: expect.any(String),
    });
  });

  it("should return an error, registered user already exists", async () => {
    vi.spyOn(userRepository, "getUser").mockResolvedValue({
      ...data,
      id: chance.guid({ version: 4 }),
    });

    await expect(sut.execute(data)).rejects.toThrow(
      new ErrorHandler(400, "User exists, try again")
    );
  });
});
