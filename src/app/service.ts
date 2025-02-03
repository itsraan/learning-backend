import express from "express"
import dotenv from "dotenv"
import cros from "cors"
import { errorMiddleware } from "../middleware/error-middleware"
import { publicApi } from "../routes/public-api"
import { privateApi } from "../routes/private-api"

dotenv.config()

export const app = express()
app.use(express.json())
app.use(cros({
    origin: process.env.CLIENT_PORT,
    credentials: true
}))

app.use(publicApi)
app.use(privateApi)

app.use(errorMiddleware)