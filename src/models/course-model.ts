import { Course } from "@prisma/client"

export type CourseResponse = {
    id: string
    title: string
    description: string
    authorId: string
    category: string
    level: string
    price: number
    coverImage: string | null
    createdAt: Date
}

export type CreateCourseRequest = {
    title: string
    description: string
    authorId: string
    category: string
    level: string
    price: number
    coverImage: string
}

export type UpdateCourseRequest = {
    id: string
    title?: string
    description?: string
    authorId?: string
    category?: string
    level?: string
    price?: number
    coverImage?: string
}

export function toCourseResponse(course: Course): CourseResponse { 
    return {
        id: course.id,
        title: course.title,
        description: course.description,
        authorId: course.authorId,
        category: course.category,
        level: course.level,
        price: course.price,
        coverImage: course.coverImage,
        createdAt: course.createdAt
    }
}