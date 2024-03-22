import express, { Request, Response } from "express"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"

import authRouter from "./features/auth/routes"
import errorMiddleware from "./middleware/error"
import categoryRouter from "./features/category/routes"
import productRouter from "./features/products/router"
import initDb from "./config/db"
import logger from "./config/logger"
import { PORT } from "./config"
import cors from "cors"

const app = express()

const corsOption: cors.CorsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}

app.use(cors(corsOption))

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
    process.exit(1)
  }
}

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static("public"))

app.get("/", (req: Request, res: Response) => res.send({ message: "all ok!" }))

app.use("/api/auth", authRouter)
app.use("/api/category", categoryRouter)
app.use("/api/product", productRouter)
app.use(errorMiddleware)

void startServer()

export default app
