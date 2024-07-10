import Chance from "chance";
import {
  InMemoryEmailTokenRepository,
  InMemoryUserRepository,
} from "@/repository/in-memory";
import { ValidEmailToken } from "./valid-email-token";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ErrorHandler } from "@/http/middleware/errorResponse";
import moment from "moment";

const chance = new Chance();

let emailRepository: InMemoryEmailTokenRepository;
let userRepository: InMemoryUserRepository;
let sut: ValidEmailToken;

beforeEach(() => {
  (emailRepository = new InMemoryEmailTokenRepository()),
    (userRepository = new InMemoryUserRepository()),
    (sut = new ValidEmailToken(emailRepository, userRepository));
});

const user = {
  id: chance.guid({ version: 4 }),
  name: chance.name(),
  email: chance.email(),
  phone: chance.phone(),
  gender: chance.gender(),
  dateBirth: chance.date().toISOString(),
  password: chance.guid({ version: 4 }),
};

describe("Valid Email Token Use Case Unit Test", () => {
  const token = chance.string({ numeric: true, length: 5 });

  it("should valid email token with successaly", async () => {
    vi.spyOn(userRepository, "getUser").mockResolvedValue(user);

    vi.spyOn(emailRepository, "checkEmailToken").mockResolvedValue({
      id: chance.string(),
      email: user.email,
      token,
      validated: false,
      attempts: chance.integer({ min: 0, max: 2 }),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.spyOn(emailRepository, "updateEmailToken");

    await sut.execute({
      email: user.email,
      token,
    });

    expect(userRepository.getUser).toHaveBeenCalledWith({ email: user.email });
    expect(emailRepository.checkEmailToken).toHaveBeenCalledWith(user.email);
    expect(emailRepository.updateEmailToken).toHaveBeenCalledWith({
      email: user.email,
      validated: true,
    });
  });

  it("should return error, user not exist", async () => {
    vi.spyOn(userRepository, "getUser").mockResolvedValue(null);

    await expect(
      sut.execute({
        email: user.email,
        token,
      })
    ).rejects.toThrow(new ErrorHandler(400, "Email not exists, try again"));
  });

  it("should return error, token not existssss", async () => {
    vi.spyOn(userRepository, "getUser").mockResolvedValue(user);

    vi.spyOn(emailRepository, "checkEmailToken").mockResolvedValue(null);

    await expect(
      sut.execute({
        email: user.email,
        token,
      })
    ).rejects.toThrow(new ErrorHandler(400, "Token not exists, try again"));
  });

  it("should return error, attempts exceeded", async () => {
    vi.spyOn(userRepository, "getUser").mockResolvedValue(user);

    vi.spyOn(emailRepository, "checkEmailToken").mockResolvedValue({
      id: chance.string(),
      email: user.email,
      token,
      validated: false,
      attempts: chance.integer({ min: 3, max: 3 }),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(
      sut.execute({
        email: user.email,
        token,
      })
    ).rejects.toThrow(
      new ErrorHandler(
        400,
        "Number of attempts exceeded, please create a new token"
      )
    );
  });

  it("should return error, token has expired", async () => {
    vi.spyOn(userRepository, "getUser").mockResolvedValue(user);

    vi.spyOn(emailRepository, "checkEmailToken").mockResolvedValue({
      id: chance.string(),
      email: user.email,
      token,
      validated: false,
      attempts: chance.integer({ min: 3, max: 3 }),
      createdAt: chance.date(),
      updatedAt: chance.date(),
    });

    await expect(
      sut.execute({
        email: user.email,
        token,
      })
    ).rejects.toThrow(new ErrorHandler(400, "Token has expired, create again"));
  });

  it("should return error, token is invalid", async () => {
    vi.spyOn(userRepository, "getUser").mockResolvedValue(user);

    vi.spyOn(emailRepository, "checkEmailToken").mockResolvedValue({
      id: chance.string(),
      email: user.email,
      token,
      validated: false,
      attempts: chance.integer({ min: 1, max: 2 }),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(
      sut.execute({
        email: user.email,
        token: chance.string({ numeric: true, length: 6 }),
      })
    ).rejects.toThrow(
      new ErrorHandler(400, "The Token sent is invalid, try again")
    );
  });
});
