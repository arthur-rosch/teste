import * as z from "zod";
import { NextFunction, Request, Response } from "express";
import { makeUpdateRoomUseCase } from "../../../use-cases/factories/room/make-update-room";

export const updateRoomController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const updateRoomRequestSchema = z.object({
    name: z.string().min(3).max(50),
    ownerId: z.string(),
    roomId: z.string(),
  });

  try {
    const { name, roomId, ownerId } = updateRoomRequestSchema.parse(req.body);

    const updateRoomUseCase = makeUpdateRoomUseCase();
    await updateRoomUseCase.execute(name, roomId, ownerId);

    res.status(200).json({ message: "Room updated successfully" });
  } catch (error) {
    next(error);
  }
};
