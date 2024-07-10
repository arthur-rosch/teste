import { PrismaClient } from '@prisma/client'
import { UserRepository } from '../../../repository/prisma/prisma-user-repository'
import { DeleteUser } from '../../cases/user/delete-user'
import { EmailTokenRepository } from '../../../repository/prisma';

export function makeDeleteUser() {
  const prisma = new PrismaClient()

  const emailRepository = new EmailTokenRepository(prisma);
  const userRepository = new UserRepository(prisma)
  const deleteUser = new DeleteUser(userRepository, emailRepository)

  return deleteUser
}
