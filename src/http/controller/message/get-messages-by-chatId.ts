import { z } from 'zod'
import { makeGetMessagesByChatId } from '@/use-cases/factories/message/get-messages-by-chatId'
import { NextFunction, Request, Response } from 'express'

export async function getMessagesByChatId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const bodySchema = z.object({
      chatId: z.string(),
    })

    const { chatId } = bodySchema.parse(req.params)

    const getMessageByChatId = makeGetMessagesByChatId()

    const messagesByUser = await getMessageByChatId.execute({ chatId })

    res.status(200).send(messagesByUser)
  } catch (error) {
    next(error)
  }
}
