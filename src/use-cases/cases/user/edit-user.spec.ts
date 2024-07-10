import Chance from "chance";
import { EditUser } from "./edit-user";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ErrorHandler } from "@/http/middleware/errorResponse";
import { InMemoryUserRepository } from "@/repository/in-memory/";

const chance = new Chance();

let userRepository: InMemoryUserRepository;
let sut: EditUser;

beforeEach(() => {
  userRepository = new InMemoryUserRepository();
  sut = new EditUser(userRepository);
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

describe("Edit User Test", () => {
  it("should return the new edited user", async () => {
    vi.spyOn(userRepository, "getUser").mockResolvedValue(user);

    const alterUser = {
      name: chance.word(),
      email: user.email,
      phone: chance.phone(),
    };

    const result = await sut.execute(alterUser);

    expect(result).toEqual({
      name: alterUser.name,
      email: alterUser.email,
      phone: alterUser.phone,
      gender: user.gender,
      dateBirth: user.dateBirth,
    });
  });

  it("should return an error, user does not exist", async () => {
    vi.spyOn(userRepository, "getUser").mockResolvedValueOnce(null);

    await expect(sut.execute(user)).rejects.toThrow(
      new ErrorHandler(400, "User not exists, try again")
    ); 
  });
});
