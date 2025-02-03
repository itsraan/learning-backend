import { CourseProgress } from "@prisma/client"

export type ProgressResponse = {
    id: string
    userId: string
    courseId: string
    progress: number
    completedLessons: string | null
    lastAccessedAt: Date
}

export type CreateProgressRequest = {
    completedLessons?: string 
    progress: number
}

export type UpdateProgressRequest = {
    completedLessons?: string 
    progress?: number
}

export function toProgressResponse(progress: CourseProgress): ProgressResponse {
    return {
        id: progress.id,
        userId: progress.userId,
        courseId: progress.courseId,
        progress: progress.progress,
        completedLessons: progress.completedLessons,
        lastAccessedAt: progress.lastAccessedAt
    }
}