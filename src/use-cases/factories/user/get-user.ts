import { PrismaClient } from "@prisma/client";
import { GetUser } from "../../cases/user/get-user";
import { UserRepository } from "@/repository/prisma";

export function makeGetUser() {
  const prisma = new PrismaClient();
  const userRepository = new UserRepository(prisma);
  return new GetUser(userRepository);
}
