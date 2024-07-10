import { makeAddUserInProjectUseCase } from "../../../use-cases/factories/project/add-user-in-project";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export async function addUserInProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bodySchema = z.object({
      ownerId: z.string(),
      projectId: z.string(),
      userId: z.string(),
    });

    const data = bodySchema.parse(req.body);

    const addUserInProjectUseCase = makeAddUserInProjectUseCase();

    const result = await addUserInProjectUseCase.execute(data);

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
}
