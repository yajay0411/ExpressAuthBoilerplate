import { Request, Response, NextFunction } from "express";
import { HttpError } from "http-errors";
import { configuration } from "../config/Config";

const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    message: err.message,
    errorStack: configuration.env === "development" ? err.stack : "",
  });
};

export default globalErrorHandler;
