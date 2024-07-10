import { NextFunction, Request, Response } from "express";
import { makeGetUser } from "../../../use-cases/factories/user/get-user";

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userUsecase = makeGetUser();

    const users = await userUsecase.execute();

    res.status(200).send(users);
  } catch (error) {
    next(error);
  }
}
