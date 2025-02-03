import { CreateCourseRequest, UpdateCourseRequest } from "../models/course-model"
import { CourseService } from "../services/course-service"
import { UserRequest } from "../util/type/type"
import { Response, NextFunction } from "express"

export class CourseController {
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: CreateCourseRequest = req.body as CreateCourseRequest
            const response = await CourseService.create(req.user!, request)
            res.status(201).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const courseId = req.params.id
            const response = await CourseService.get(req.user!, courseId)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async getAll(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await CourseService.getAll(req.user!)
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
            const request: UpdateCourseRequest = req.body as UpdateCourseRequest
            const response = await CourseService.update(req.user!, id, request)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async delete(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const courseId = req.params.id
            await CourseService.delete(req.user!, courseId)
            res.status(200).json({
                data: "OK"
            })
        } catch (error) {
            next(error)
        }
    }

    static async uploadPicture(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const courseCoverImage = await CourseService.coverImage(req.user!, req.file!)
            res.status(200).json({
                data: courseCoverImage
            })
        } catch (error) {
            next(error)
        }
    }
}
