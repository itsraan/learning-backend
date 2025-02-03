import { ZodType, z } from "zod"
import { CourseLevel } from "@prisma/client"

export class CourseValidation {
    static readonly CREATE: ZodType = z.object({
        title: z.string().min(1).max(100),
        description: z.string().min(1).max(1000),
        category: z.string().min(1).max(100),
        level: z.nativeEnum(CourseLevel),
        price: z.number().min(1),
        coverImage: z.string().max(1000).optional()
    })

    static readonly UPDATE: ZodType = z.object({
        title: z.string().min(1).max(100).optional(),
        description: z.string().min(1).max(1000).optional(),
        category: z.string().min(1).max(100).optional(),
        level: z.nativeEnum(CourseLevel).optional(),
        price: z.number().min(1).optional(),
        coverImage: z.string().max(1000).optional()
    })
}