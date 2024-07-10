import { makeCreateAnnotation } from "@/use-cases/factories/annotation/create";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export async function createAnnotation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bodySchema = z.object({
      information: z.string(),
      title: z.string(),
      color: z.string(),
      userId: z.string(),
    });

    const data = bodySchema.parse(req.body);

    const annotationUseCase = makeCreateAnnotation();

    const annotation = await annotationUseCase.execute(data);

    res.status(200).send(annotation);
  } catch (error) {
    next();
  }
}
