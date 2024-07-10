import { UserRepository } from "../../../repository/prisma";
import { EmailTokenRepository } from "../../../repository/prisma/prisma-emailToken-repository";
import { ValidEmailToken } from "../../../use-cases/cases/email/valid-email-token";
import { PrismaClient } from "@prisma/client";

export function makeValidEmailToken() {
  const prisma = new PrismaClient();
  const userRepository = new UserRepository(prisma);
  const emailTokenRepository = new EmailTokenRepository(prisma);

  return new ValidEmailToken(emailTokenRepository, userRepository);
}
