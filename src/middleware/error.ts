import { Request, Response } from "express"
import { HttpError } from "http-errors"
import logger from "../config/logger"

export default function (err: HttpError, req: Request, res: Response) {
  logger.error(err.message)
  const statusCode = err.statusCode || err.status || 500
  res.status(statusCode).json({
    error: [
      {
        type: err.name,
        msg: err.message,
        path: "",
        location: "",
      },
    ],
  })
}
