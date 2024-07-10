import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Chance from "chance";
import { LoginUser } from "./login-user";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ErrorHandler } from "@/http/middleware/errorResponse";
import {
  InMemoryEmailTokenRepository,
  InMemoryUserRepository,
} from "@/repository/in-memory/";

const chance = new Chance();

let userRepository: InMemoryUserRepository;
let emailRepository: InMemoryEmailTokenRepository;
let sut: LoginUser;

beforeEach(() => {
  userRepository = new InMemoryUserRepository();
  emailRepository = new InMemoryEmailTokenRepository();
  sut = new LoginUser(userRepository, emailRepository);

  dotenv.config();
});

const user = {
  id: chance.guid({ version: 4 }),
  name: chance.string(),
  email: chance.email(),
  phone: chance.phone(),
  gender: chance.gender(),
  dateBirth: chance.date().toISOString(),
  password: chance.guid({ version: 4 }),
};

describe("Login User Test", () => {
  it("should log in successfully", async () => {
    vi.spyOn(userRepository, "getUser").mockResolvedValue(user);

    vi.spyOn(emailRepository, "checkEmailToken").mockResolvedValue({
      id: chance.string(),
      email: user.email,
      token: chance.guid({version: 4}),
      validated: true,
      attempts: chance.integer({ min: 0, max: 2 }),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const mockPasswordCompare = vi.fn().mockResolvedValue(true);

    vi.spyOn(bcrypt, "compare").mockImplementation(mockPasswordCompare);

    const token = await sut.execute({
      email: user.email,
      password: user.password,
    });

    expect(token).toEqual({
      token: expect.any(String),
      user,
    });
  });

  it("should return an error, user does not exist", async () => {
    vi.spyOn(userRepository, "getUser").mockResolvedValueOnce(null);

    await expect(sut.execute(user)).rejects.toThrow(
      new ErrorHandler(400, "User not exists, try again")
    );
  });

  it("should return an error, email not validate ", async () => {
    vi.spyOn(userRepository, "getUser").mockResolvedValue(user);

    vi.spyOn(emailRepository, "checkEmailToken").mockResolvedValue({
      id: chance.string(),
      email: user.email,
      token: chance.guid({ version: 4 }),
      validated: false,
      attempts: chance.integer({ min: 0, max: 2 }),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(sut.execute(user)).rejects.toThrow(
      new ErrorHandler(400, "You need to validate your email to log in")
    );
  })

  it("should return an error, different passwords", async () => {
    vi.spyOn(userRepository, "getUser").mockResolvedValue(user);

    vi.spyOn(emailRepository, "checkEmailToken").mockResolvedValue({
      id: chance.string(),
      email: user.email,
      token: chance.guid({ version: 4 }),
      validated: true,
      attempts: chance.integer({ min: 0, max: 2 }),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const mockPasswordCompare = vi.fn().mockResolvedValue(false);

    vi.spyOn(bcrypt, "compare").mockImplementation(mockPasswordCompare);

    await expect(sut.execute(user)).rejects.toThrow(
      new ErrorHandler(400, "Password is not equal")
    );
  });

  it("should return an error, key jwt is not defined", async () => {
    vi.spyOn(userRepository, "getUser").mockResolvedValue(user);

    vi.spyOn(emailRepository, "checkEmailToken").mockResolvedValue({
      id: chance.string(),
      email: user.email,
      token: chance.guid({ version: 4 }),
      validated: true,
      attempts: chance.integer({ min: 0, max: 2 }),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const originalJwtSecret = process.env.JWT_SECRET;

    delete process.env.JWT_SECRET;
    const mockPasswordCompare = vi.fn().mockResolvedValue(true);

    vi.spyOn(bcrypt, "compare").mockImplementation(mockPasswordCompare);

    await expect(sut.execute(user)).rejects.toThrow(
      new ErrorHandler(500, "Key is not defined")
    );

    process.env.JWT_SECRET = originalJwtSecret;
  });
});
