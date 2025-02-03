import { CreateLessonRequest, UpdateLessonRequest } from "../models/lesson-model"
import { LessonService } from "../services/lesson-service"
import { UserRequest } from "../util/type/type"
import { Response, NextFunction } from "express"

export class LessonController {
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const moduleId = req.params.id
            const request: CreateLessonRequest = req.body as CreateLessonRequest
            const response = await LessonService.create(req.user!, moduleId, request)
            res.status(201).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const lessonId = req.params.id
            const response = await LessonService.get(req.user!, lessonId)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async getAll(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const moduleId = req.params.id
            const response = await LessonService.getAll(req.user!, moduleId)
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
            const request: UpdateLessonRequest = req.body as UpdateLessonRequest
            const response = await LessonService.update(req.user!, id, request)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async delete(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const lessonId = req.params.id
            await LessonService.delete(req.user!, lessonId)
            res.status(200).json({
                data: "OK"
            })
        } catch (error) {
            next(error)
        }
    }
}