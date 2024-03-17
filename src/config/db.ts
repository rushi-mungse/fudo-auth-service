import mongoose from "mongoose"
import config from "config"

const initDb = async () => {
  const DB_URL: string = config.get("database.url")
  await mongoose.connect(DB_URL)
}

export default initDb
