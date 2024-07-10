import { makeGetAllMessages } from '../../../use-cases/factories/message/get-all-messages'
import { NextFunction, Request, Response } from 'express'

export async function getAllMessages(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const messageusecase = makeGetAllMessages()

    const allMessages = await messageusecase.execute()

    res.status(200).send(allMessages)
  } catch (error) {
    next(error)
  }
}
