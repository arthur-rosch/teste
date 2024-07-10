import Chance from "chance";
import { InMemoryUserRepository } from "@/repository/in-memory";
import { GetUser } from "./get-user";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ErrorHandler } from "@/http/middleware/errorResponse";

const chance = new Chance();

let userRepository: InMemoryUserRepository;
let sut: GetUser;

beforeEach(() => {
  userRepository = new InMemoryUserRepository();
  sut = new GetUser(userRepository);
});

const createUser = () => ({
  id: chance.guid({ version: 4 }),
  name: chance.name(),
  email: chance.email(),
  phone: chance.phone(),
  gender: chance.gender(),
  dateBirth: chance.date().toISOString(),
  password: chance.guid({ version: 4 }),
});

describe("Get User User Case Test", () => {
  it("should return successfully registered users", async () => {
    const userFirst = createUser();
    const userOld = createUser();

    vi.spyOn(userRepository, "getAllUsers").mockResolvedValue([
      userFirst,
      userOld,
    ]);

    const result = await sut.execute();

    expect(result).toEqual([
      {
        id: userFirst.id,
        name: userFirst.name,
        email: userFirst.email,
      },
      {
        id: userOld.id,
        name: userOld.name,
        email: userOld.email,
      },
    ]);

    expect(userRepository.getAllUsers).toHaveBeenCalledTimes(1);
  });

  it("should return error, users not registered", async () => {
    vi.spyOn(userRepository, "getAllUsers").mockResolvedValue(null);

    expect(sut.execute()).rejects.toThrow(
      new ErrorHandler(400, "Not registered users")
    );
  });
});
