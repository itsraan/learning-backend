import { CreateAssignmentRequest, UpdateAssignmentRequest, AssignmentResponse, toAssignmentResponse } from "../models/assignment-model"
import { Validation } from "../util/validation/validation"
import { AssignmentValidation } from "../util/validation/assignment-validation"
import { prismaClient } from "../app/database"
import { ResponseError } from "../util/error/error"
import { User } from "@prisma/client"

export class AssignmentService {
    static async create(user: User, lessonId: string, request: CreateAssignmentRequest): Promise<AssignmentResponse> {
        const lesson = await prismaClient.lesson.findFirst({
            where: {
                id: lessonId,
                module: {
                    course: {
                        authorId: user.id
                    }
                }
            }
        })

        if(!lesson) {
            throw new ResponseError(400, "Lesson tidak ditemukan atau Anda tidak memiliki akses")
        }

        const existingAssignment = await prismaClient.assignment.findFirst({
            where: {
                lessonId: lesson.id
            }
        })

        if(existingAssignment) {
            throw new ResponseError(400, "Assignment sudah ada untuk lesson ini")
        }

        const createRequest = Validation.validate(AssignmentValidation.CREATE, request)
        const createResponse = await prismaClient.assignment.create({
            data: {
                ...createRequest,
                ...{lessonId: lesson.id},
                ...{authorId: user.id}
            },
            include: {
                lesson: true,
                author: true
            }
        })

        return toAssignmentResponse(createResponse)
    }

    static async get(user: User, id: string): Promise<AssignmentResponse> {
        const assignment = await prismaClient.assignment.findFirst({
            where: { id },
            include: {
                lesson: {
                    include: {
                        module: {
                            include: {
                                course: {
                                    select: { authorId: true }
                                }
                            }
                        }
                    }
                },
                author: true
            }
        })
    
        if (!assignment) {
            throw new ResponseError(404, "Assignment tidak ditemukan")
        }
    
        if (user.role === "INSTRUCTOR" && assignment.authorId !== user.id) {
            throw new ResponseError(403, "Anda tidak berhak mengakses assignment ini")
        }
    
        return toAssignmentResponse(assignment)    
    }
    
    static async getAll(user: User): Promise<AssignmentResponse[]> {
        const assignments = await prismaClient.assignment.findMany({
            include: {
                lesson: {
                    include: {
                        module: {
                            include: {
                                course: {
                                    select: { authorId: true }
                                }
                            }
                        }
                    }
                },
                author: true
            },
            orderBy: { title: 'desc' }
        })
    
        if (user.role === "INSTRUCTOR") {
            return assignments
                .filter(assignment => assignment.authorId === user.id)
                .map(toAssignmentResponse)
        }
    
        return assignments.map(toAssignmentResponse)    
    }
    
    static async getAllByLesson(lessonId: string): Promise<AssignmentResponse[]> {
        const assignments = await prismaClient.assignment.findMany({
            where: { lessonId },
            include: {
                lesson: true,
                author: true
            },
            orderBy: { dueDate: 'desc' }
        })
    
        return assignments.map(toAssignmentResponse)    
    }
    
    static async update(user: User, id: string, request: UpdateAssignmentRequest): Promise<AssignmentResponse> {
        const assignment = await prismaClient.assignment.findFirst({
            where: { id },
            include: {
                lesson: {
                    include: {
                        module: {
                            include: {
                                course: {
                                    select: { authorId: true }
                                }
                            }
                        }
                    }
                },
                author: true
            }
        })
    
        if (!assignment) {
            throw new ResponseError(404, "Assignment tidak ditemukan")
        }
    
        if (
            user.role === "STUDENT" ||
            (user.role === "INSTRUCTOR" && assignment.lesson.module.course.authorId !== user.id)
        ) {
            throw new ResponseError(403, "Anda tidak berhak mengubah assignment ini")
        }
    
        const updateRequest = Validation.validate(AssignmentValidation.UPDATE, request)
    
        const updateResponse = await prismaClient.assignment.update({
            where: { id },
            data: updateRequest,
            include: {
                lesson: true,
                author: true
            }
        })
    
        return toAssignmentResponse(updateResponse)    
    }
    
    static async delete(user: User, id: string): Promise<AssignmentResponse> {
        const assignment = await prismaClient.assignment.findFirst({
            where: { id },
            include: {
                lesson: {
                    include: {
                        module: {
                            include: {
                                course: {
                                    select: { authorId: true }
                                }
                            }
                        }
                    }
                },
                author: true
            }
        })
    
        if (!assignment) {
            throw new ResponseError(404, "Assignment tidak ditemukan")
        }
    
        if (
            user.role === "STUDENT" ||
            (user.role === "INSTRUCTOR" && assignment.lesson.module.course.authorId !== user.id)
        ) {
            throw new ResponseError(403, "Anda tidak berhak mengubah assignment ini")
        }
    
        const deleteResponse = await prismaClient.assignment.delete({
            where: { id },
            include: {
                lesson: true,
                author: true
            }
        })
    
        return toAssignmentResponse(deleteResponse)    
    }
}