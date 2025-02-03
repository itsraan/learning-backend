import { UpdateEnrollRequest, EnrollResponse, toEnrollmentResponse } from "../models/enrollment-model"
import { Validation } from "../util/validation/validation"
import { EnrollmentValidation } from "../util/validation/enrollment-validation"
import { prismaClient } from "../app/database"
import { ResponseError } from "../util/error/error"
import { User } from "@prisma/client"

export class EnrollmentService {
    static async create(user: User, courseId: string): Promise<EnrollResponse> {
        const course = await prismaClient.course.findFirst({
            where: {
                id: courseId,
                NOT: {
                    authorId: user.id
                }
            }
        })

        if(!course) {
            throw new ResponseError(400, "Course not found or you cannot enroll in your own course")
        }

        const existingEnrollment = await prismaClient.enrollment.findFirst({
            where: {
                userId: user.id,
                courseId: course.id
            }
        })

        if(existingEnrollment) {
            throw new ResponseError(400, "You are already enrolled in this course")
        }

        const createResponse = await prismaClient.enrollment.create({
            data: {
                userId: user.id,
                courseId: course.id
            },
            include: {
                user: true,
                course: true
            }
        })

        return toEnrollmentResponse(createResponse)
    }

    static async get(user: User, id: string): Promise<EnrollResponse> {
        const enrollment = await prismaClient.enrollment.findFirst({
            where: {
                id,
                userId: user.id
            },
            include: {
                user: true,
                course: true
            }
        })
    
        if (!enrollment) {
            throw new ResponseError(404, "Enrollment not found")
        }
    
        return toEnrollmentResponse(enrollment)
    }
    
    static async getAll(user: User): Promise<EnrollResponse[]> {
        const enrollments = await prismaClient.enrollment.findMany({
            where: {
                userId: user.id
            },
            include: {
                user: true,
                course: true
            },
            orderBy: {
                enrolledAt: 'desc'
            }
        })
    
        return enrollments.map(toEnrollmentResponse)
    }
    
    static async getAllByCourse(courseId: string): Promise<EnrollResponse[]> {
        const enrollments = await prismaClient.enrollment.findMany({
            where: {
                courseId
            },
            include: {
                user: true,
                course: true
            },
            orderBy: {
                enrolledAt: 'desc'
            }
        })
    
        return enrollments.map(toEnrollmentResponse)
    }
    
    static async update(user: User, id: string, request: UpdateEnrollRequest): Promise<EnrollResponse> {
        const enrollment = await prismaClient.enrollment.findFirst({
            where: {
                id,
                userId: user.id
            },
            include: {
                user: true,
                course: true
            }
        })
    
        if (!enrollment) {
            throw new ResponseError(404, "Enrollment not found")
        }
    
        const updateRequest = Validation.validate(EnrollmentValidation.UPDATE, request)
    
        const updateResponse = await prismaClient.enrollment.update({
            where: { id },
            data: updateRequest,
            include: {
                user: true,
                course: true
            }
        })
    
        return toEnrollmentResponse(updateResponse)
    }
    
    static async delete(user: User, id: string): Promise<EnrollResponse> {
        const enrollment = await prismaClient.enrollment.findFirst({
            where: {
                id,
                userId: user.id
            },
            include: {
                user: true,
                course: true
            }
        })
    
        if (!enrollment) {
            throw new ResponseError(404, "Enrollment not found")
        }
    
        const deleteResponse = await prismaClient.enrollment.delete({
            where: { id },
            include: {
                user: true,
                course: true
            }
        })
    
        return toEnrollmentResponse(deleteResponse)
    }
}