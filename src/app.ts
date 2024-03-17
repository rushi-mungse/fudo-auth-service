import express from "express"
import errorMiddleware from "./middleware/error"

const app = express()

app.get("/", (req, res) => {
  return res.send({ message: "all ok!" })
})

app.use(errorMiddleware)
export default app
