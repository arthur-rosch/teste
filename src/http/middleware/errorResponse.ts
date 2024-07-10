import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export class ErrorHandler extends Error {
  public statusCode: number;
  public message: string;

  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

export const handleError = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: "Validation error",
      errors: err.errors.map((e) => ({
        path: e.path,
        message: e.message,
      })),
    });

    return;
  }

  const { statusCode, message } = err;
  res.status(statusCode || 500).json({
    status: "error",
    statusCode,
    message,
  });
};
