import { z, ZodType } from "zod";

export class AssignmentValidation {
    static readonly CREATE: ZodType = z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        maxScore: z.number().min(0).max(100).nonnegative(),
        dueDate: z.preprocess(
        (val) => (typeof val === "string" ? new Date(val) : val),
        z.date()
        )
    })

    static readonly UPDATE: ZodType = z.object({
        title: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        maxScore: z.number().min(0).max(100).optional(),
        dueDate: z.preprocess(
        (val) => (typeof val === "string" ? new Date(val) : val),
        z.date().optional()
        )
    })
}
