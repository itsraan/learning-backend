import { CreateUserRequest, UpdateUserRequest, LoginUserRequest } from "../models/user-model"
import { UserService } from "../services/user-service"
import { UserRequest } from "../util/type/type"
import { Request, Response, NextFunction } from "express"

export class UserController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateUserRequest = req.body as CreateUserRequest
            const response = await UserService.register(request)
            res.status(201).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await UserService.get(req.user!)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async getAll(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await UserService.getAll()
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateUserRequest = req.body as UpdateUserRequest
            const response = await UserService.update(req.user!, request)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async delete(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id
            await UserService.delete(userId)
            res.status(200).json({
                data: "OK"
            })
        } catch (error) {
            next(error)
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const request: LoginUserRequest = req.body as LoginUserRequest
            const response = await UserService.login(request)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async logout(req: UserRequest, res: Response, next: NextFunction) {
        try {
            await UserService.logout(req.user!)
            res.status(200).json({
                data: "OK"
            })
        } catch (error) {
            next(error)
        }
    }
}