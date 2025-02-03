import { ZodType, z } from "zod"

export class ProgressValidation {
    static readonly CREATE: ZodType = z.object({
        completedLessons: z.string().min(1).max(100).optional(),
        progress: z.number().min(0).max(100)
    })

    static readonly UPDATE: ZodType = z.object({
        completedLessons: z.string().min(1).max(100).optional(),
        progress: z.number().min(0).max(100).optional()
    })
}