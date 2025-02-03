import { CreateSubmissionRequest, UpdateSubmissionUpdateRequest } from "../models/submission-model"
import { SubmissionService } from "../services/submission-service"
import { UserRequest } from "../util/type/type"
import { Response, NextFunction } from "express"

export class SubmissionController {
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const assignmentId = req.params.id
            const request: CreateSubmissionRequest = req.body as CreateSubmissionRequest
            const response = await SubmissionService.create(req.user!, assignmentId, request)
            res.status(201).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const submissionId = req.params.id
            const response = await SubmissionService.get(req.user!, submissionId)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async getAll(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await SubmissionService.getAll(req.user!)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async getAllBySubmission(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const assignmentId = req.params.id
            const response = await SubmissionService.getAllBySubmission(assignmentId)
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
            const request: UpdateSubmissionUpdateRequest = req.body as UpdateSubmissionUpdateRequest
            const response = await SubmissionService.update(req.user!, id, request)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async delete(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const submissionId = req.params.id
            await SubmissionService.delete(req.user!, submissionId)
            res.status(200).json({
                data: "OK"
            })
        } catch (error) {
            next(error)
        }
    }
}