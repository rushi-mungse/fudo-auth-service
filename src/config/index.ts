import { config } from "dotenv"
config()

export const {
  PORT,
  DB_URL,
  JWKS_URL,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  HASH_SECRET,
  PRIVATE_KEY,
  REFRESH_TOKEN_SECRET,
} = process.env
