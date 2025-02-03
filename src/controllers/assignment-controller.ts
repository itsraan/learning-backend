import { CreateAssignmentRequest, UpdateAssignmentRequest } from "../models/assignment-model"
import { AssignmentService } from "../services/assignment-service"
import { UserRequest } from "../util/type/type"
import { Response, NextFunction } from "express"

export class AssignmentController {
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const lessonId = req.params.id
            const request: CreateAssignmentRequest = req.body as CreateAssignmentRequest
            const response = await AssignmentService.create(req.user!, lessonId, request)
            res.status(201).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const assignmentId = req.params.id
            const response = await AssignmentService.get(req.user!, assignmentId)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async getAll(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await AssignmentService.getAll(req.user!)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async getAllByLesson(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const lessonId = req.params.id
            const response = await AssignmentService.getAllByLesson(lessonId)
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
            const request: UpdateAssignmentRequest = req.body as UpdateAssignmentRequest
            const response = await AssignmentService.update(req.user!, id, request)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async delete(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const assignmentId = req.params.id
            await AssignmentService.delete(req.user!, assignmentId)
            res.status(200).json({
                data: "OK"
            })
        } catch (error) {
            next(error)
        }
    }
}