import { PrismaClient } from "@prisma/client";
import { UserRepository } from "../../../repository/prisma/prisma-user-repository";
import { CreateUser } from "../../cases/user/create-user";
import { SendEmailToken } from "@/service/sendEmail";
import { EmailTokenRepository } from "@/repository/prisma/prisma-emailToken-repository";

export function makeCreateUser() {
  const prisma = new PrismaClient();
  const userRepository = new UserRepository(prisma);
  const emailService = new SendEmailToken();
  const emailRepository = new EmailTokenRepository(prisma);

  const createUser = new CreateUser(
    userRepository,
    emailService,
    emailRepository
  );

  return createUser;
}
export { CreateUser };
