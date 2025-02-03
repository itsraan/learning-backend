import { UserController } from "../controllers/user-controller"
import express from "express"

export const publicApi = express.Router()

publicApi.post("/api/register", UserController.register)
publicApi.post("/api/login", UserController.login)