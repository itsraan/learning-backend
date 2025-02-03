import { Lesson } from "@prisma/client"

export type LessonResponse = {
    id: string
    title: string
    content: string
    videoUrl: string | null
    resourceUrls: string | null
    order: number
}

export type CreateLessonRequest = {
    title: string
    content: string
    videoUrl: string
    resourceUrls: string
    order: number
}

export type UpdateLessonRequest = {
    title?: string
    content?: string
    videoUrl?: string
    resourceUrls?: string
    order?: number
}

export function toLessonResponse(lesson: Lesson): LessonResponse {
    return {
        id: lesson.id,
        title: lesson.title,
        content: lesson.content,
        videoUrl: lesson.videoUrl,
        resourceUrls: lesson.resourceUrls,
        order: lesson.order
    }
}