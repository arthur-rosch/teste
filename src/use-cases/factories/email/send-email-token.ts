import { UserRepository } from "../../../repository/prisma";
import { EmailTokenRepository } from "../../../repository/prisma/prisma-emailToken-repository";
import { SendEmailToken } from "../../../service/sendEmail";
import { SendEmailTokenUseCase } from "../../../use-cases/cases/email/send-email-token";
import { PrismaClient } from "@prisma/client";

export function makeSendEmailToken() {
  const prisma = new PrismaClient();
  const emailTokenRepository = new EmailTokenRepository(prisma);
  const userRepository = new UserRepository(prisma);
  const sendEmail = new SendEmailToken();

  return new SendEmailTokenUseCase(
    userRepository,
    sendEmail,
    emailTokenRepository
  );
}
