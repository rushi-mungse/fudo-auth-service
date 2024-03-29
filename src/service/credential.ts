import crypto from "crypto"
import bcrypt from "bcrypt"
import createHttpError from "http-errors"
import { ICredentialService } from "../types"
import { HASH_SECRET } from "../config"

class CredentialService implements ICredentialService {
  async hashData(data: string): Promise<string> {
    const SALT = 10
    return await bcrypt.hash(data, SALT)
  }

  async hashCompare(data: string, hashData: string): Promise<boolean> {
    return await bcrypt.compare(data, hashData)
  }

  hashDataWithSecret(data: string): string {
    if (!HASH_SECRET) throw createHttpError(500, "Hash secret is not found!")
    return crypto.createHmac("sha256", HASH_SECRET).update(data).digest("hex")
  }

  getOtp(): number {
    return crypto.randomInt(1000, 9999)
  }
}

export default CredentialService
