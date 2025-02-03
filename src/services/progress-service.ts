import { CreateProgressRequest, UpdateProgressRequest, ProgressResponse, toProgressResponse } from "../models/progress-model"
import { Validation } from "../util/validation/validation"
import { ProgressValidation } from "../util/validation/progress-validation"
import { prismaClient } from "../app/database"
import { ResponseError } from "../util/error/error"
import { User } from "@prisma/client"

export class ProgressService {
    static async create(user: User, courseId: string, request: CreateProgressRequest): Promise<ProgressResponse> {
        const course = await prismaClient.course.findFirst({
            where: {
                id: courseId,
                enrollments: {
                    some: { userId: user.id }
                }
            }
        })

        if (!course) {
            throw new ResponseError(400, "Course tidak ditemukan atau Anda tidak terdaftar di kursus ini")
        }

        const existingProgress = await prismaClient.courseProgress.findFirst({
            where: {
                courseId: courseId,
                userId: user.id
            }
        })

        if (existingProgress) {
            throw new ResponseError(400, "Progress sudah ada untuk kursus ini")
        }

        const createRequest = Validation.validate(ProgressValidation.CREATE, request)
        const createResponse = await prismaClient.courseProgress.create({
            data: {
                ...createRequest,
                userId: user.id,
                courseId: course.id
            },
            include: {
                course: true,
                user: true
            }
        })

        return toProgressResponse(createResponse)
    }

    static async get(user: User, id: string): Promise<ProgressResponse> {
        const progress = await prismaClient.courseProgress.findFirst({
            where: {
                id,
                userId: user.id
            },
            include: {
                course: true,
                user: true
            }
        })

        if (!progress) {
            throw new ResponseError(404, "Progress tidak ditemukan")
        }

        return toProgressResponse(progress)
    }

    static async getAll(user: User): Promise<ProgressResponse[]> {
        const progresses = await prismaClient.courseProgress.findMany({
            where: {
                userId: user.id
            },
            include: {
                course: true,
                user: true
            },
            orderBy: {
                lastAccessedAt: 'desc'
            }
        })

        return progresses.map(toProgressResponse)
    }

    static async getAllByCourse(courseId: string): Promise<ProgressResponse[]> {
        const progresses = await prismaClient.courseProgress.findMany({
            where: {
                courseId
            },
            include: {
                course: true,
                user: true
            },
            orderBy: {
                lastAccessedAt: 'desc'
            }
        })

        return progresses.map(toProgressResponse)
    }

    static async update(user: User, id: string, request: UpdateProgressRequest): Promise<ProgressResponse> {
        const progress = await prismaClient.courseProgress.findFirst({
            where: {
                id,
                userId: user.id
            },
            include: {
                course: true,
                user: true
            }
        })

        if (!progress) {
            throw new ResponseError(404, "Progress tidak ditemukan")
        }

        const updateRequest = Validation.validate(ProgressValidation.UPDATE, request)
        const updateResponse = await prismaClient.courseProgress.update({
            where: { id },
            data: updateRequest,
            include: {
                course: true,
                user: true
            }
        })

        return toProgressResponse(updateResponse)
    }

    static async delete(user: User, id: string): Promise<ProgressResponse> {
        const progress = await prismaClient.courseProgress.findFirst({
            where: {
                id,
                userId: user.id
            },
            include: {
                course: true,
                user: true
            }
        })

        if (!progress) {
            throw new ResponseError(404, "Progress tidak ditemukan")
        }

        const deleteResponse = await prismaClient.courseProgress.delete({
            where: { id },
            include: {
                course: true,
                user: true
            }
        })

        return toProgressResponse(deleteResponse)
    }
}