import { EmailToken } from "@prisma/client";

export interface IEmailToken {
  create(data: EmailToken): Promise<void>;
  checkEmailToken(email: string): Promise<EmailToken | null>;
  deleteEmailToken(email: string): Promise<void>;
  updateAttemptsEmailToken(data: Partial<EmailToken>): Promise<void>;
  updateEmailToken(data: Partial<EmailToken>): Promise<void>;
}
