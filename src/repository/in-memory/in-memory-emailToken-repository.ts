import { EmailToken } from "@prisma/client";
import { IEmailToken } from "../email";

export class InMemoryEmailTokenRepository implements IEmailToken {
  private tokens: EmailToken[] = [];

  async create(data: EmailToken): Promise<void> {
    this.tokens.push(data);
  }

  async checkEmailToken(email: string): Promise<EmailToken | null> {
    const token = this.tokens.find((token) => token.email === email);
    return token || null;
  }

  async deleteEmailToken(email: string): Promise<void> {
    this.tokens = this.tokens.filter((token) => token.email !== email);
  }

  async updateAttemptsEmailToken(data: Partial<EmailToken>): Promise<void> {
    const tokenIndex = this.tokens.findIndex(
      (token) => token.email === data.email
    );
    if (tokenIndex !== -1) {
      this.tokens[tokenIndex].attempts = data.attempts || 0;
    }
  }

  async updateEmailToken(data: Partial<EmailToken>): Promise<void> {
    const tokenIndex = this.tokens.findIndex(
      (token) => token.email === data.email
    );
    if (tokenIndex !== -1) {
      this.tokens[tokenIndex].validated = data.validated || false;
    }
  }
}
