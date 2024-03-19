import { Request } from "express"
import config from "config"
import jwksClient from "jwks-rsa"
import { GetVerificationKey, expressjwt } from "express-jwt"

import { ICookieData } from "../types"
import logger from "../config/logger"

const JWKS_URL: string = config.get("urls.jwks_url")

const checkAccessToken = expressjwt({
  secret: jwksClient.expressJwtSecret({
    jwksUri: JWKS_URL ?? "",
    cache: true,
    rateLimit: true,
  }) as GetVerificationKey,

  algorithms: ["RS256"],

  getToken(req: Request) {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.split(" ")[1] !== "undefined") {
      const accessToken = authHeader.split(" ")[1]
      if (accessToken) return accessToken
    }

    const { accessToken } = req.cookies as ICookieData
    return accessToken
  },
})

export default checkAccessToken
