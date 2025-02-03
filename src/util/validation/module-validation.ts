import { ZodType, z } from "zod"

export class ModuleValidation {
    static readonly CREATE: ZodType = z.object({
        title: z.string().min(1).max(100),
        description: z.string().min(1).max(1000),
        order: z.number().min(1)
    })
    static readonly UPDATE: ZodType = z.object({
        title: z.string().min(1).max(100).optional(),
        description: z.string().min(1).max(1000).optional(),
        order: z.number().min(1).optional()
    })
}