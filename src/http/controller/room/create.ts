import * as z from "zod";
import { NextFunction, Request, Response } from "express";
import { makeCreateRoomUseCase } from "../../../use-cases/factories/room/make-create-room";

export const createRoomController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const CreateRoomRequestSchema = z.object({
    name: z.string().min(3).max(50),
    user_id: z.string(),
  });

  try {
    const { name, user_id } = CreateRoomRequestSchema.parse(req.body);

    const createRoomUseCase = makeCreateRoomUseCase();
    const createdRoom = await createRoomUseCase.execute({
      name,
      ownerId: user_id,
    });

    res.status(201).json(createdRoom);
  } catch (error) {
    next(error);
  }
};
