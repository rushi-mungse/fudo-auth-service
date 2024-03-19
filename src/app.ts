import express from "express"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"

import authRouter from "./auth/routes"
import errorMiddleware from "./middleware/error"

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.json())
app.use(express.static("public"))

app.use("/api/auth", authRouter)
app.use(errorMiddleware)

export default app
