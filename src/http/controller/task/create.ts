import { makeCreateTask } from "@/use-cases/factories/task/create";
import { Status } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export async function createTask(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const StatusSchema = z.enum([
      Status.Analysis,
      Status.Completed,
      Status.Development,
      Status.Testing,
      Status.To_Do,
    ]);

    const bodySchema = z.object({
      title: z.string(),
      information: z.string(),
      files: z.string(),
      status: StatusSchema,
      projectId: z.string(),
      responsibleId: z.string(),
    });

    const data = bodySchema.parse(req.body);

    const taskUseCase = makeCreateTask();

    const task = await taskUseCase.execute(data);

    return res.status(200).send(task);
  } catch (error) {
    next(error);
  }
}
