import { NextFunction, Request, Response } from "express";
import { makeCreateUser } from "../../../use-cases/factories/user/create-user";
import { z } from "zod";

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const querySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      phone: z.string(),
      gender: z.string(),
      dateBirth: z.string(),
      password: z.string().min(6),
      confirmPassword: z.string().min(6),
    });

    const data = querySchema.parse(req.body);

    const userusecase = makeCreateUser();

    const createUser = await userusecase.execute(data);

    res.status(200).send(createUser);
  } catch (error) {
    next(error);
  }
}
