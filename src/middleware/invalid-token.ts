import { NextFunction, Response, Request } from "express"
import createHttpError from "http-errors"

import { ICookieData } from "../types"
import TokenService from "../service/token"
import TokenModel from "../model/token"
import logger from "../config/logger"

const tokenService = new TokenService(TokenModel)

const invalidToken = function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { refreshToken } = req.cookies as ICookieData
  if (!refreshToken) return next()

  try {
    const token = tokenService.verifyRefreshToken(refreshToken)
    if (token) return next(createHttpError(400, "User already login!"))
    return next()
  } catch (error) {
    return next(error)
  }
}

export default invalidToken
