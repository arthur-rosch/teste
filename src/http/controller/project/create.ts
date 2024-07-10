import { makeCreateProject } from "@/use-cases/factories/project/create";
import { Prisma, Privacy } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export async function createProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const privacySchema = z.enum([Privacy.Private, Privacy.Public]);

    const bodySchema = z.object({
      name: z.string(),
      color: z.string(),
      ownerId: z.string(),
      privacy: privacySchema,
      usersIds: z.array(z.string()),
    });

    const data = bodySchema.parse(req.body);

    const createProjectUserCase = makeCreateProject();

    const result = await createProjectUserCase.execute(data);

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
}
