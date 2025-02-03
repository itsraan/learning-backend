import { CreateSubmissionRequest, UpdateSubmissionUpdateRequest, SubmissionResponse, toSubmissionResponse } from "../models/submission-model"
import { Validation } from "../util/validation/validation"
import { SubmissionValidation } from "../util/validation/submission-validation"
import { prismaClient } from "../app/database"
import { ResponseError } from "../util/error/error"
import { User } from "@prisma/client"

export class SubmissionService {
    static async create(user: User, assignmentId: string, request: CreateSubmissionRequest): Promise<SubmissionResponse> {
        const assignment = await prismaClient.assignment.findFirst({
            where: {
                id: assignmentId,
                lesson: {
                    module: {
                        course: {
                            enrollments: {
                                some: { userId: user.id }
                            }
                        }
                    }
                }
            }
        })

        if(!assignment) {
            throw new ResponseError(400, "Assignment tidak ditemukan atau Anda tidak terdaftar di kursus ini")
        }

        const existingSubmission = await prismaClient.submission.findFirst({
            where: {
                assignmentId: assignment.id,
                userId: user.id
            }
        })

        if(existingSubmission) {
            throw new ResponseError(400, "Submission sudah ada untuk assignment ini")
        }

        const createRequest = Validation.validate(SubmissionValidation.CREATE, request)
        const createResponse = await prismaClient.submission.create({
            data: {
                ...createRequest,
                userId: user.id,
                assignmentId: assignment.id
            },
            include: {
                assignment: true,
                user: true
            }
        })

        return toSubmissionResponse(createResponse)
    }

    static async get(user: User, id: string): Promise<SubmissionResponse> {
        const submission = await prismaClient.submission.findFirst({
            where: {
                id,
                userId: user.id
            },
            include: {
                assignment: true,
                user: true
            }
        })

        if(!submission) {
            throw new ResponseError(404, "Submission tidak ditemukan")
        }

        return toSubmissionResponse(submission)
    }

    static async getAll(user: User): Promise<SubmissionResponse[]> {
        const submissions = await prismaClient.submission.findMany({
            where: {
                userId: user.id
            },
            include: {
                assignment: true,
                user: true
            },
            orderBy: {
                submittedAt: 'desc'
            }
        })

        return submissions.map(toSubmissionResponse)
    }

    static async getAllBySubmission(assignmentId: string): Promise<SubmissionResponse[]> {
        const submissions = await prismaClient.submission.findMany({
            where: {
                assignmentId
            },
            include: {
                assignment: true,
                user: true
            },
            orderBy: {
                submittedAt: 'desc'
            }
        })

        return submissions.map(toSubmissionResponse)
    }

    static async update(user: User, id: string, request: UpdateSubmissionUpdateRequest): Promise<SubmissionResponse> {
        const submission = await prismaClient.submission.findFirst({
            where: {
                id,
                userId: user.id
            },
            include: {
                assignment: true,
                user: true
            }
        })

        if(!submission) {
            throw new ResponseError(404, "Submission tidak ditemukan")
        }

        const updateRequest = Validation.validate(SubmissionValidation.UPDATE, request)
        const updateResponse = await prismaClient.submission.update({
            where: { id },
            data: updateRequest,
            include: {
                assignment: true,
                user: true
            }
        })

        return toSubmissionResponse(updateResponse)
    }

    static async delete(user: User, id: string): Promise<SubmissionResponse> {
        const submission = await prismaClient.submission.findFirst({
            where: {
                id,
                userId: user.id
            },
            include: {
                assignment: true,
                user: true
            }
        })

        if(!submission) {
            throw new ResponseError(404, "Submission tidak ditemukan")
        }

        const deleteResponse = await prismaClient.submission.delete({
            where: { id },
            include: {
                assignment: true,
                user: true
            }
        })

        return toSubmissionResponse(deleteResponse)
    }
}