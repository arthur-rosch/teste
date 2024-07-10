import { makeGetMessagesByUserId } from '@/use-cases/factories/message/get-messages-by-userId'
import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

export async function getMessagesByUserId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const paramSchema = z.object({
      userId: z.string(),
    })

    const { userId } = paramSchema.parse(req.params)

    const getMessageByChatId = makeGetMessagesByUserId()

    const messagesByUser = await getMessageByChatId.execute({ userId })

    res.status(200).send(messagesByUser)
  } catch (error) {
    next(error)
  }
}
