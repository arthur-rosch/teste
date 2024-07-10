import * as z from "zod";
import { NextFunction, Request, Response } from "express";
import { AuthReq } from "@/@types/authRequest";
import { makeRemoveUserToRoomUseCase } from "@/use-cases/factories/room/make-remove-user-to-room";

export const removeUserToRoomController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const RemoveUserToRoomRequestSchema = z.object({
    roomId: z.string(),
    removeUserId: z.string(),
    ownerId: z.string(),
  });

  try {
    const { roomId, removeUserId, ownerId } =
      RemoveUserToRoomRequestSchema.parse(req.body);

    const removeUserToRoomUseCase = makeRemoveUserToRoomUseCase();
    await removeUserToRoomUseCase.execute(roomId, removeUserId, ownerId);

    res.status(200).json({ message: "User removed to room successfully" });
  } catch (error) {
    next(error);
  }
};
