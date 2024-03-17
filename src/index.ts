import app from "./app"
import logger from "./config/logger"

const PORT = 5000

const startServer = () => {
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
