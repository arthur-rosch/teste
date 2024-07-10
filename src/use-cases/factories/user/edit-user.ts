import { PrismaClient } from '@prisma/client'
import { UserRepository } from '../../../repository/prisma/prisma-user-repository'
import { EditUser } from '../../cases/user/edit-user'

export function makeEditUser() {
  const prisma = new PrismaClient()
  const userRepository = new UserRepository(prisma)
  const editUser = new EditUser(userRepository)

  return editUser
}
