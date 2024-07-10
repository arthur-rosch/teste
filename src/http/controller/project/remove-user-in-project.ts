import { makeRemoveUserInProjectUseCase } from "@/use-cases/factories/project/remove-user-in-project";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export async function removeUserInProject(
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

    const removeUserInProjectUseCase = makeRemoveUserInProjectUseCase();

    const projects = await removeUserInProjectUseCase.execute(data);

    res.status(200).send(projects);
  } catch (error) {
    next(error);
  }
}
