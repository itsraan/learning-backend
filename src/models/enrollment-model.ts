import { Enrollment } from "@prisma/client"

export type EnrollResponse = {
    id: string
    userId: string
    courseId: string
    enrolledAt: Date
    completedAt: Date | null
}

export type UpdateEnrollRequest = {
    completedAt?: Date
}

export function toEnrollmentResponse(enrollment: Enrollment): EnrollResponse {
    return {
        id: enrollment.id,
        userId: enrollment.userId,
        courseId: enrollment.courseId,
        enrolledAt: enrollment.enrolledAt,
        completedAt: enrollment.completedAt
    }
}