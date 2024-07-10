import { makeDeleteAnnotation } from "@/use-cases/factories/annotation/delete";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export async function deleteAnnotation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bodySchema = z.object({
      userId: z.string(),
      annotationId: z.string(),
    });

    const data = bodySchema.parse(req.body);

    const annotationUseCase = makeDeleteAnnotation();

    await annotationUseCase.execute(data);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
