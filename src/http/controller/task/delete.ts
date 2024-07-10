import { makeDeleteTask } from "@/use-cases/factories/task/delete";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export async function deleteTask(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bodySchema = z.object({
      taskId: z.string(),
      userId: z.string(),
    });

    const { taskId, userId } = bodySchema.parse(req.body);

    const taskUseCase = makeDeleteTask();

    const task = await taskUseCase.execute(taskId, userId);

    return res.status(200).send(task);
  } catch (error) {
    next(error);
  }
}
