import { makeUpdateTaskStatus } from "@/use-cases/factories/task/update-status";
import { Status } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export async function updateTaskStatus(
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
      taskId: z.string(),
      status: StatusSchema,
      userId: z.string(),
    });

    const { taskId, status, userId } = bodySchema.parse(req.body);

    const taskUseCase = makeUpdateTaskStatus();

    const task = await taskUseCase.execute(taskId, status, userId);

    return res.status(200).send(task);
  } catch (error) {
    next(error);
  }
}
