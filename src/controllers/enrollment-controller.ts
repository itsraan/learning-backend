import { UpdateEnrollRequest } from "../models/enrollment-model"
import { EnrollmentService } from "../services/enrollment-service"
import { UserRequest } from "../util/type/type"
import { Response, NextFunction } from "express"

export class EnrollmentController {
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const courseId = req.params.id
            const response = await EnrollmentService.create(req.user!, courseId)
            res.status(201).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const enrollmentId = req.params.id
            const response = await EnrollmentService.get(req.user!, enrollmentId)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async getAll(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await EnrollmentService.getAll(req.user!)
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
            const response = await EnrollmentService.getAllByCourse(courseId, req.user!)
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
            const request: UpdateEnrollRequest = req.body as UpdateEnrollRequest
            const response = await EnrollmentService.update(req.user!, id, request)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async delete(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const enrollmentId = req.params.id
            await EnrollmentService.delete(req.user!, enrollmentId)
            res.status(200).json({
                data: "OK"
            })
        } catch (error) {
            next(error)
        }
    }
}