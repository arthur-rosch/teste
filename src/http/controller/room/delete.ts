import { NextFunction, Request, Response } from "express";
import { AuthReq } from "@/@types/authRequest";
import { makeDeleteRoomUseCase } from "@/use-cases/factories/room/make-delete-room";
import { z } from "zod";

export const deleteRoomController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const paramsSchema = z.object({
    roomId: z.string(),
  });

  const bodySchema = z.object({
    user_id: z.string(),
  });

  try {
    const { user_id } = bodySchema.parse(req.body);
    const { roomId } = paramsSchema.parse(req.params);

    const deleteRoomUseCase = makeDeleteRoomUseCase();
    await deleteRoomUseCase.execute(roomId, user_id);

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    next(error);
  }
};
