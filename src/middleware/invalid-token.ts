import { NextFunction, Response, Request } from "express"
import createHttpError from "http-errors"

import { ICookieData, TJwtPayload } from "../types"
import TokenService from "../service/token"
import TokenModel from "../model/token"
import logger from "../config/logger"
import AuthService from "../features/auth/service"
import UserModel from "../features/auth/model"

const tokenService = new TokenService(TokenModel)
const userService = new AuthService(UserModel)

const invalidToken = function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { refreshToken } = req.cookies as ICookieData
  if (!refreshToken) return next()
  try {
    const token = tokenService.verifyRefreshToken(refreshToken) as TJwtPayload
    const userId = token.userId
    const user = userService.getById(userId)
    if (!user) return next()
    logger.info(token)
    if (token) return next(createHttpError(400, "User already login!"))
    return next()
  } catch (error) {
    return next(error)
  }
}

export default invalidToken
