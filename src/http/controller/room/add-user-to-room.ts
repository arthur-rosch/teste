import * as z from "zod";
import { NextFunction, Request, Response } from "express";
import { makeAddUserToRoomUseCase } from "@/use-cases/factories/room/make-add-user-to-room";

export const addUserToRoomController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const AddUserToRoomRequestSchema = z.object({
    roomId: z.string(),
    addUserId: z.string(),
    ownerId: z.string(),
  });

  try {
    const { roomId, addUserId, ownerId } = AddUserToRoomRequestSchema.parse(
      req.body
    );

    const addUserToRoomUseCase = makeAddUserToRoomUseCase();
    await addUserToRoomUseCase.execute(roomId, addUserId, ownerId);

    res.status(200).json({ message: "User added to room successfully" });
  } catch (error) {
    next(error);
  }
};
