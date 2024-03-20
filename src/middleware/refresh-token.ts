import { Request } from "express"
import { expressjwt } from "express-jwt"

import TokenModel from "../model/token"
import { ICookieData, TJwtPayload } from "../types"
import { REFRESH_TOKEN_SECRET } from "../config"
import logger from "../config/logger"

const checkRefreshToken = expressjwt({
  secret: REFRESH_TOKEN_SECRET ?? "",
  algorithms: ["HS256"],
  getToken(req: Request) {
    const { refreshToken } = req.cookies as ICookieData
    return refreshToken
  },
  async isRevoked(req: Request, token) {
    if (!token) return true
    const payload = token.payload as TJwtPayload

    try {
      const tokenRef = await TokenModel.findOne({
        _id: payload.tokenId,
        userId: payload.userId,
      })
      return tokenRef === null
    } catch (error) {
      logger.error("Error while getting the refresh token", {
        userId: payload.userId,
      })
      return true
    }
  },
})

export default checkRefreshToken
