import { makeGetProjectsByUserIdUseCase } from "../../../use-cases/factories/project/get-projects-by-user-id";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export async function getProjectsByUserId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bodySchema = z.object({
      userId: z.string(),
    });

    const { userId } = bodySchema.parse(req.body);

    const getProjectsByUserIdUseCase = makeGetProjectsByUserIdUseCase();

    const projects = await getProjectsByUserIdUseCase.execute(userId);

    res.status(200).send(projects);
  } catch (error) {
    next(error);
  }
}
