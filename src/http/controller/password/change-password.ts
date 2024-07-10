import { makeChangePassword } from "../../../use-cases/factories/password/change-password";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export async function ChangePassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string(),
      confirmPassword: z.string(),
    });

    const data = bodySchema.parse(req.body);

    const changePasswordUseCase = makeChangePassword();

    await changePasswordUseCase.execute(data);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
