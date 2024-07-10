import { makeDeleteProject } from "../../../use-cases/factories/project/delete";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export async function deleteProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bodySchema = z.object({
      projectId: z.string(),
      ownerId: z.string(),
    });

    const { projectId, ownerId } = bodySchema.parse(req.body);

    const deleteProjectUseCase = makeDeleteProject();

    await deleteProjectUseCase.execute(projectId, ownerId);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
