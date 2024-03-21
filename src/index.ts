import app from "./app"
import logger from "./config/logger"
import initDb from "./config/db"
import { PORT } from "./config"

const startServer = async () => {
  try {
    await initDb()
    logger.info("Database connected successfully.")

    app.listen(PORT, () => {
      logger.info(`Server listening on port ${PORT}.`)
    })
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message)
      logger.on("finish", () => process.exit(1))
    }
    logger.error("Server Internal Error!")
  }
}

void startServer()
