import express from "express"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"

import authRouter from "./features/auth/routes"
import errorMiddleware from "./middleware/error"
import categoryRouter from "./features/category/routes"
import productRouter from "./features/products/router"

const app = express()

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static("public"))

app.use("/api/auth", authRouter)
app.use("/api/category", categoryRouter)
app.use("/api/product", productRouter)
app.use(errorMiddleware)

export default app
