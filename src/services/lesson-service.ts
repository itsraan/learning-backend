import { CreateLessonRequest, UpdateLessonRequest, LessonResponse, toLessonResponse } from "../models/lesson-model"
import { Validation } from "../util/validation/validation"
import { LessonValidation } from "../util/validation/lesson-validation"
import { prismaClient } from "../app/database"
import { ResponseError } from "../util/error/error"
import { User } from "@prisma/client"

export class LessonService {
    static async create(user: User, moduleId: string, request: CreateLessonRequest): Promise<LessonResponse> {
        const module = await prismaClient.module.findFirst({
            where: {
                id: moduleId,
                course: {
                    authorId: user.id
                }
            }
        })

        if(!module) {
            throw new ResponseError(400, "You are not authorized to create lesson for this module")
        }

        const createRequest = Validation.validate(LessonValidation.CREATE, request)
        const existingLesson = await prismaClient.lesson.findFirst({
            where: {
                moduleId: module.id,
                OR: [
                    { title: createRequest.title },
                    { order: createRequest.order }
                ]
            }
        })
    
        if (existingLesson) {
            if (existingLesson.title === createRequest.title) {
                throw new ResponseError(400, "Lesson with this title already exists")
            } else {
                throw new ResponseError(400, "Lesson with this order already exists")
            }
        }

        const recordData = {
            ...createRequest,
            ...{moduleId: module.id}
        }

        const createResponse = await prismaClient.lesson.create({
            data: recordData
        })

        return toLessonResponse(createResponse)
    }

    static async get(user: User, id: string): Promise<LessonResponse> {
        const lesson = await prismaClient.lesson.findUnique({
            where: {
                id,
                module: {
                    course: {
                        authorId: user.id
                    }
                }
            }
        })

        if(!lesson) {
            throw new ResponseError(400, "Lesson not found")
        }

        return toLessonResponse(lesson)
    }

    static async getAll(user: User, moduleId: string): Promise<LessonResponse[]> {
        const module = await prismaClient.module.findFirst({
            where: {
                id: moduleId,
                course: {
                    authorId: user.id
                }
            }
        })

        if(!module) {
            throw new ResponseError(403, "You are not authorized to access this module")
        }

        const lessons = await prismaClient.lesson.findMany({
            where: {
                moduleId,
                module: {
                    course: {
                        authorId: user.id
                    }
                }
            },
            orderBy: {
                order: 'asc',
            }
        })

        return lessons.map(toLessonResponse)
    }

    static async update(user: User, id: string, request: UpdateLessonRequest): Promise<LessonResponse> {
        const lesson = await prismaClient.lesson.findFirst({
            where: {
                id,
                module: {
                    course: {
                        authorId: user.id
                    }
                }
            }
        })

        if(!lesson) {
            throw new ResponseError(400, "Lesson not found")
        }

        const updateRequest = Validation.validate(LessonValidation.UPDATE, request)
        if(updateRequest.order) {
            const existingOrder = await prismaClient.lesson.findFirst({
                where: {
                    moduleId: lesson.moduleId,
                    order: updateRequest.order,
                    id: { not: id }
                }
            })

            if(existingOrder) {
                throw new ResponseError(400, "Lesson order already exists in this module")
            }
        }

        const updateResponse = await prismaClient.lesson.update({
            where: { id },
            data: updateRequest
        })

        return toLessonResponse(updateResponse)
    }

    static async delete(user: User, id: string): Promise<LessonResponse> {
        const lesson = await prismaClient.lesson.findUnique({
            where: {
                id,
                module: {
                    course: {
                        authorId: user.id
                    }
                }
            }
        })

        if(!lesson) {
            throw new ResponseError(400, "Lesson not found")
        }
        
        const deleteResponse = await prismaClient.lesson.delete({
            where: { id }
        })

        return toLessonResponse(deleteResponse)
    }
}