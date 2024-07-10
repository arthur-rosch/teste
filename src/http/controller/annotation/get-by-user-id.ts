import { makeGetByUserIdAnnotation } from "@/use-cases/factories/annotation/get-by-user-id";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export async function getByUserId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const reqParse = z.object({
      userId: z.string(),
    });

    const data = reqParse.parse(req.params);

    const annotationUseCase = makeGetByUserIdAnnotation();

    const annotation = await annotationUseCase.execute(data);

    res.status(200).send(annotation);
  } catch (error) {
    next(error);
  }
}
