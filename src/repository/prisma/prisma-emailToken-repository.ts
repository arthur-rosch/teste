import { EmailToken, PrismaClient } from '@prisma/client'
import { IEmailToken } from '../email'

export class EmailTokenRepository implements IEmailToken {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async create(data: EmailToken): Promise<void> {
    const { email, token, validated, attempts } = data

    await this.prisma.emailToken.create({
      data: {
        email,
        token,
        validated,
        attempts,
      },
    })
  }

  async checkEmailToken(email: string): Promise<EmailToken | null> {
    const emailToken = this.prisma.emailToken.findFirst({
      where: {
        email,
      },
    })

    return emailToken
  }

  async deleteEmailToken(email: string): Promise<void> {
    await this.prisma.emailToken.delete({
      where: {
        email,
      },
    })
  }

  async updateAttemptsEmailToken(data: Partial<EmailToken>): Promise<void> {
    await this.prisma.emailToken.update({
      where: {
        email: data.email,
      },
      data: {
        attempts: data.attempts,
      },
    })
  }

  async updateEmailToken(data: Partial<EmailToken>): Promise<void> {
    const { email, validated } = data

    await this.prisma.emailToken.update({
      where: {
        email,
      },
      data: {
        validated,
      },
    })
  }
}
