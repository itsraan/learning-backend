import { CreateModuleRequest, UpdateModuleRequest } from "../models/module-model"
import { ModuleService } from "../services/module-service"
import { UserRequest } from "../util/type/type"
import { Response, NextFunction } from "express"

export class ModuleController {
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const courseId = req.params.id
            const request: CreateModuleRequest = req.body as CreateModuleRequest
            const response = await ModuleService.create(req.user!, courseId, request)
            res.status(201).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const moduleId = req.params.id
            const response = await ModuleService.get(req.user!, moduleId)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async getAll(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const courseId = req.params.id
            const response = await ModuleService.getAll(req.user!, courseId)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const request: UpdateModuleRequest = req.body as UpdateModuleRequest
            const response = await ModuleService.update(req.user!, id, request)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async delete(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const moduleId = req.params.id
            await ModuleService.delete(req.user!, moduleId)
            res.status(200).json({
                data: "OK"
            })
        } catch (error) {
            next(error)
        }
    }
}