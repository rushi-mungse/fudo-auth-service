import config from "config"
import app from "./app"
import logger from "./config/logger"

const startServer = () => {
  const PORT: number = config.get("server.port") || 5500
  try {
    app.listen(PORT, () => {
      logger.info(`Server listening on port ${PORT}`)
    })
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message)
      process.exit(1)
    }
    logger.error("Server Internal Error!")
  }
}

startServer()
