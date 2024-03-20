import createHttpError from "http-errors"
import { JwtPayload, sign, verify } from "jsonwebtoken"

import TokenModel from "../model/token"
import { IToken, TJwtPayload } from "../types"
import { PRIVATE_KEY, REFRESH_TOKEN_SECRET } from "../config"

class TokenService {
  constructor(private tokenModel: typeof TokenModel) {}

  signAccessToken(payload: TJwtPayload): string {
    if (!PRIVATE_KEY) throw createHttpError(500, "PRIVATE_KEY is not found!")

    const accessToken = sign(payload, PRIVATE_KEY, {
      algorithm: "RS256",
      expiresIn: "24h",
      issuer: "fudo-service",
    })

    return accessToken
  }

  signRefreshToken(payload: TJwtPayload): string {
    if (!REFRESH_TOKEN_SECRET)
      throw createHttpError(500, "TOKEN_SECRET is not found!")

    const refreshToken = sign(payload, REFRESH_TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "1y",
      issuer: "fudo-service",
      jwtid: String(payload.id),
    })

    return refreshToken
  }

  verifyRefreshToken(refreshToken: string): JwtPayload | string {
    if (!REFRESH_TOKEN_SECRET)
      throw createHttpError(500, "SECRET_HASH is not found!")
    return verify(refreshToken, REFRESH_TOKEN_SECRET)
  }

  async save(tokenData: IToken) {
    return await this.tokenModel.create(tokenData)
  }

  async delete(tokenId: string) {
    return await this.tokenModel.deleteOne({ _id: tokenId })
  }

  async deleteUsingUserId(userId: string) {
    return await this.tokenModel.deleteOne({ userId })
  }
}

export default TokenService
