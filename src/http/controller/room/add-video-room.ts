import { makeAddVideoRoom } from "@/use-cases/factories/room/make-add-video-room";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export async function addVideoRoom(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bodySchema = z.object({
      ownerId: z.string(),
      roomId: z.string(),
      roomLink: z.string(),
    });

    const data = bodySchema.parse(req.body);

    const roomUseCase = makeAddVideoRoom();

    const result = await roomUseCase.execute(data);

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
}
