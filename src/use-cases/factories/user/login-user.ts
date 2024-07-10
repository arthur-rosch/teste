import { PrismaClient } from '@prisma/client'
import { UserRepository } from '../../../repository/prisma/prisma-user-repository'
import { LoginUser } from '../../cases/user/login-user'
import { EmailTokenRepository } from '../../../repository/prisma'

export function makeLoginUser() {
  const prisma = new PrismaClient()
  const userRepository = new UserRepository(prisma)
  const emailRepository = new EmailTokenRepository(prisma);
  const loginUser = new LoginUser(userRepository, emailRepository)

  return loginUser
}
