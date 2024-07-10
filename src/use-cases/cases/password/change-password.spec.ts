import Chance from "chance";
import {
  InMemoryEmailTokenRepository,
  InMemoryUserRepository,
} from "@/repository/in-memory";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ChangePassword } from "./change-password";
import { ErrorHandler } from "@/http/middleware/errorResponse";

const chance = new Chance();

let emailRepository: InMemoryEmailTokenRepository;
let userRepository: InMemoryUserRepository;
let sut: ChangePassword;

beforeEach(() => {
  (userRepository = new InMemoryUserRepository()),
    (emailRepository = new InMemoryEmailTokenRepository());
  sut = new ChangePassword(userRepository, emailRepository);
});

const createUser = {
  id: chance.guid({ version: 4 }),
  name: chance.name(),
  email: chance.email(),
  phone: chance.phone(),
  gender: chance.gender(),
  dateBirth: chance.date().toISOString(),
  password: chance.guid({ version: 4 }),
};

describe("Change Password Use Case Test", () => {
  const password = chance.string();

  const userParams = {
    email: createUser.email,
    password,
    confirmPassword: password,
  };

  it("should change password successfully", async () => {
    vi.spyOn(userRepository, "getUser").mockResolvedValue(createUser);

    const emailToken = {
      id: chance.string(),
      email: createUser.email,
      token: chance.string({ numeric: true, length: 6 }),
      validated: true,
      attempts: chance.integer({ min: 0, max: 2 }),
      createdAt: chance.date(),
      updatedAt: chance.date(),
    };

    vi.spyOn(emailRepository, "checkEmailToken").mockResolvedValue(emailToken);

    await sut.execute(userParams);

    expect(userRepository.getUser).toHaveBeenCalledWith({
      email: userParams.email,
    });
    expect(emailRepository.checkEmailToken).toBeCalledWith(userParams.email);
  });

  it("should return error, user not exist", async () => {
    vi.spyOn(userRepository, "getUser").mockResolvedValue(null);

    await expect(sut.execute(userParams)).rejects.toThrow(
      new ErrorHandler(400, "Email not exists, try again")
    );
  });

  it("should return error, token not exist", async () => {
    vi.spyOn(userRepository, "getUser").mockResolvedValue(createUser);

    vi.spyOn(emailRepository, "checkEmailToken").mockResolvedValue(null);

    await expect(sut.execute(userParams)).rejects.toThrow(
      new ErrorHandler(400, "Token not exists, try again")
    );
  });

  it("should return error, token not validated", async () => {
    vi.spyOn(userRepository, "getUser").mockResolvedValue(createUser);

    const emailToken = {
      id: chance.string(),
      email: createUser.email,
      token: chance.string({ numeric: true, length: 6 }),
      validated: false,
      attempts: chance.integer({ min: 0, max: 2 }),
      createdAt: chance.date(),
      updatedAt: chance.date(),
    };

    vi.spyOn(emailRepository, "checkEmailToken").mockResolvedValue(emailToken);

    await expect(sut.execute(userParams)).rejects.toThrow(
      new ErrorHandler(
        400,
        "The Token has not yet been validated, please try again"
      )
    );
  });

  it("should return error, password is not the same", async () => {
    vi.spyOn(userRepository, "getUser").mockResolvedValue(createUser);

    const emailToken = {
      id: chance.string(),
      email: createUser.email,
      token: chance.string({ numeric: true, length: 6 }),
      validated: true,
      attempts: chance.integer({ min: 0, max: 2 }),
      createdAt: chance.date(),
      updatedAt: chance.date(),
    };

    vi.spyOn(emailRepository, "checkEmailToken").mockResolvedValue(emailToken);

    await expect(
      sut.execute({
        email: userParams.email,
        password: userParams.password,
        confirmPassword: chance.string(),
      })
    ).rejects.toThrow(new ErrorHandler(400, "Password is not equal"));
  });
});
