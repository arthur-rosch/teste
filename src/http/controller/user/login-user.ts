import { NextFunction, Request, Response } from "express";
import { makeLoginUser } from "@/use-cases/factories/user/login-user";
import { z } from "zod";

export async function loginUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const querySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { email, password } = querySchema.parse(req.body);

    const userusecase = makeLoginUser();

    const auth = await userusecase.execute({ email, password });

    res.status(200).send(auth);
  } catch (error) {
    next(error);
  }
}
