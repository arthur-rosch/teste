import { UserRepository } from "../../../repository/prisma";
import { EmailTokenRepository } from "../../../repository/prisma/prisma-emailToken-repository";
import { ChangePassword } from "../../../use-cases/cases/password/change-password";
import { PrismaClient } from "@prisma/client";

export function makeChangePassword() {
  const prisma = new PrismaClient();
  const userRepository = new UserRepository(prisma);
  const emailTokenRepository = new EmailTokenRepository(prisma);

  return new ChangePassword(userRepository, emailTokenRepository);
}
