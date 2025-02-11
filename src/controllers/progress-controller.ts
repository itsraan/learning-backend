import { CreateProgressRequest, UpdateProgressRequest } from "../models/progress-model"
import { ProgressService } from "../services/progress-service"
import { UserRequest } from "../util/type/type"
import { Response, NextFunction } from "express"

export class ProgressController {
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const courseId = req.params.id
            const request: CreateProgressRequest = req.body as CreateProgressRequest
            const response = await ProgressService.create(req.user!, courseId, request)
            res.status(201).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const progressId = req.params.id
            const response = await ProgressService.get(req.user!, progressId)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async getAll(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await ProgressService.getAll(req.user!)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async getAllByCourse(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const courseId = req.params.id
            const response = await ProgressService.getAllByCourse(courseId, req.user!)
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
            const request: UpdateProgressRequest = req.body as UpdateProgressRequest
            const response = await ProgressService.update(req.user!, id, request)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async delete(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const progressId = req.params.id
            await ProgressService.delete(req.user!, progressId)
            res.status(200).json({
                data: "OK"
            })
        } catch (error) {
            next(error)
        }
    }
}