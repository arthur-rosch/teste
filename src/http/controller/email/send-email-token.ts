import { makeSendEmailToken } from "@/use-cases/factories/email/send-email-token";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export async function SendEmailToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bodySchema = z.object({
      email: z.string().email(),
    });

    const { email } = bodySchema.parse(req.body);

    const emailUseCase = makeSendEmailToken();

    await emailUseCase.execute(email);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
