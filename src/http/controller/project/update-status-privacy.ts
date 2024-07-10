import { makeUpdateStatusPrivacyProjectUseCase } from "../../../use-cases/factories/project/update-status-privacy";
import { Privacy } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export async function updateStatusPrivacy(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const privacySchema = z.enum([Privacy.Private, Privacy.Public]);

    const bodySchema = z.object({
      projectId: z.string(),
      ownerId: z.string(),
      statusPrivacy: privacySchema,
    });

    const { projectId, ownerId, statusPrivacy } = bodySchema.parse(req.body);

    const updateStatusPrivacyProjectUseCase =
      makeUpdateStatusPrivacyProjectUseCase();

    const updateProject = await updateStatusPrivacyProjectUseCase.execute(
      projectId,
      ownerId,
      statusPrivacy
    );

    res.status(200).send(updateProject);
  } catch (error) {
    next(error);
  }
}
