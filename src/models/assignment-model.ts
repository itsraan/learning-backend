import { Assignment } from "@prisma/client"

export type AssignmentResponse = {
    id: string
    lessonId: string
    authorId: string
    title: string
    description: string
    maxScore: number
    dueDate: Date
}

export type CreateAssignmentRequest = {
    title: string
    description: string
    maxScore: number
    dueDate: Date
}

export type UpdateAssignmentRequest = {
    title?: string
    description?: string
    maxScore?: number
    dueDate?: Date
}

export function toAssignmentResponse(assignment: Assignment): AssignmentResponse {
    return {
        id: assignment.id,
        lessonId: assignment.lessonId,
        authorId: assignment.authorId,
        title: assignment.title,
        description: assignment.description,
        maxScore: assignment.maxScore,
        dueDate: assignment.dueDate
    }
}