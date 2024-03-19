import { JwtPayload } from "jsonwebtoken"
import { IUserModel } from "../auth/type"

export type TJwtPayload = JwtPayload & {
  userId: string
  role: string
  tokenId?: string
}

export interface ICredentialService {
  hashData(data: string): Promise<string>
  hashCompare(data: string, hashData: string): Promise<boolean>
  hashDataWithSecret(data: string): string
  getOtp(): number
}

export interface IToken {
  userId: IUserModel["_id"]
  expiresAt: Date
}

export type ITokenModel = IToken & Document

export interface ICookieData {
  accessToken: string
  refreshToken: string
}
