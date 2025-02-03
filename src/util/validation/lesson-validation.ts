import { ZodType, z } from "zod"

export class LessonValidation {
    static readonly CREATE: ZodType = z.object({
        title: z.string().min(1).max(100),
        content: z.string().min(1).max(1000),
        videoUrl: z.string().min(1).max(100).optional(),
        resourceUrls: z.string().min(1).max(100).optional(),
        order: z.number().min(1)
    })
    static readonly UPDATE: ZodType = z.object({
        title: z.string().min(1).max(100).optional(),
        content: z.string().min(1).max(1000).optional(),
        videoUrl: z.string().min(1).max(100).optional(),
        resourceUrls: z.string().min(1).max(100).optional(),
        order: z.number().min(1).optional()
    })
}