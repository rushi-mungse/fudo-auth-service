import { NextFunction, Response } from "express"
import { AuthRequest } from "../types"
import createHttpError from "http-errors"

const hasPermission = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const _req = req
    const roleFromToken = _req.auth.role

    if (!roles.includes(roleFromToken)) {
      const error = createHttpError(403, "You don't have enough permissions")
      return next(error)
    }
    next()
  }
}

export default hasPermission
