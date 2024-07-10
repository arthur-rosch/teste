import { NextFunction, Request, Response } from "express";
import { makeEditUser } from "@/use-cases/factories/user/edit-user";
import { z } from "zod";

export async function editUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const querySchema = z.object({
      name: z.string().optional(),
      email: z.string().email(),
      phone: z.string().optional(),
      gender: z.string().optional(),
      dateBirth: z.string().optional(),
    });

    const data = querySchema.parse(req.body);

    const userusecase = makeEditUser();

    const newUser = await userusecase.execute(data);

    res.status(200).send(newUser);
  } catch (error) {
    next(error);
  }
}
