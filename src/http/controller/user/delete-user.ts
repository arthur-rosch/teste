import { NextFunction, Request, Response } from 'express'
import { makeDeleteUser } from '../../../use-cases/factories/user/delete-user'
import { z } from 'zod'

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const querySchema = z.object({
    email: z.string().email(),
  })

  try {
    const { email } = querySchema.parse(req.body)

    const userusecase = makeDeleteUser()

    await userusecase.execute({ email })

    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}
