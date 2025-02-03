import { ZodType, z } from "zod"

export class SubmissionValidation {
    static readonly CREATE: ZodType = z.object({
        content: z.string().min(1).max(1000).regex(/^[A-Za-z0-9\s,.'-]+$/)
    })

    static readonly UPDATE: ZodType = z.object({
        grade: z.number().min(0).max(100).optional()
    })
}