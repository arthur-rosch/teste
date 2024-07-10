import { PrismaClient, User } from '@prisma/client'
import { IUserRepository } from '../user'
export class UserRepository implements IUserRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async getManyUsersByEmail(emails: string[]): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        email: {
          in: emails,
        },
      },
    })

    return users
  }

  async create(data: Partial<User>): Promise<User> {
    const { name, email, phone, gender, dateBirth, password } = data as User

    const createUser = await this.prisma.user.create({
      data: {
        name,
        email,
        phone,
        gender,
        dateBirth,
        password,
      },
    })

    return createUser
  }

  async getUser(user: Partial<User>): Promise<User | null> {
    const findUser = await this.prisma.user.findFirst({
      where: {
        email: user.email,
      },
    })

    return findUser
  }

  async getUserById(userId: string): Promise<User | null> {
    const findUser = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!findUser) {
      return null
    }

    return findUser
  }

  async editUser(data: Partial<User>): Promise<void> {
    await this.prisma.user.update({
      where: {
        email: data.email,
      },
      data,
      })
  }

  async deleteUser(user: Pick<User, 'email'>) {
    await this.prisma.user.delete({
      where: {
        email: user.email,
      },
    })
  }

  async changePassword(data: Partial<User>): Promise<void> {
    const { email, password } = data

    await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        password,
      },
    })
  }

  async getAllUsers(): Promise<User[] | null> {
    const users = await this.prisma.user.findMany()

    return users.length > 0 ? users : null
  }
}
