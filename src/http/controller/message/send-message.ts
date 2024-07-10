import { makeSendMessage } from '../../../use-cases/factories/message/send-message'
import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

export async function sendMessage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const bodySchema = z.object({
      chatId: z.string(),
      userId: z.string(),
      content: z.string(),
    })

    const { content, chatId, userId } = bodySchema.parse(req.body)

    const messageusecase = makeSendMessage()

    await messageusecase.execute({
      content,
      chatId,
      userId,
    })

    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}
