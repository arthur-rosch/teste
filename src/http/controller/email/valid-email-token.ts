import { makeValidEmailToken } from "../../../use-cases/factories/email/valid-email-token";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export async function ValidEmailToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bodySchema = z.object({
      email: z.string().email(),
      token: z.string().max(5),
    });

    const data = bodySchema.parse(req.body);

    const emailUseCase = makeValidEmailToken();

    await emailUseCase.execute(data);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
