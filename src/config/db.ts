import mongoose from "mongoose"
import { DB_URL } from "./"

const initDb = async () => {
  if (!DB_URL) throw Error("Db not connected!")
  await mongoose.connect(DB_URL)
}

export default initDb
