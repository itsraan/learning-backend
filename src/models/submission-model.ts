import { Submission } from "@prisma/client"

export type SubmissionResponse = {
    id: string
    userId: string
    assignmentId: string
    content: string
    grade: number | null
    submittedAt: Date
}

export type CreateSubmissionRequest = {
    content: string
}

export type UpdateSubmissionUpdateRequest = {
    grade: number
}

export function toSubmissionResponse(submission: Submission): SubmissionResponse {
    return {
        id: submission.id,
        userId: submission.userId,
        assignmentId: submission.assignmentId,
        content: submission.content,
        grade: submission.grade,
        submittedAt: submission.submittedAt
    }
}