import { Request, Response, NextFunction, RequestHandler } from "express"

export const asyncWrapper = (requestHandler: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      return next(err)
    })
  }
}
