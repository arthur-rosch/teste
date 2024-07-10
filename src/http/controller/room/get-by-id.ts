import { NextFunction, Request, Response } from "express";
import { makeGetRoomByIdUseCase } from "@/use-cases/factories/room/make-find-by-id";
import { z } from "zod";

export const getRoomByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const paramsSchema = z.object({
    roomId: z.string(),
  });

  try {
    const { roomId } = paramsSchema.parse(req.params);

    const getRoomByIdUseCase = makeGetRoomByIdUseCase();
    const room = await getRoomByIdUseCase.execute(roomId);

    res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};
