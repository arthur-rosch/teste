import { makeGetByIdAnnotation } from "../../../use-cases/factories/annotation/get-by-id";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export async function getByIdAnnotation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const reqParser = z.object({
      annotationId: z.string(),
    });

    const data = reqParser.parse(req.params);

    const annotationUseCase = makeGetByIdAnnotation();

    const annotation = await annotationUseCase.execute(data);

    res.sendStatus(200).send(annotation);
  } catch (error) {
    next(error);
  }
}
