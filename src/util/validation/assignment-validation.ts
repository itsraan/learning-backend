import { z, ZodType } from "zod";

export class AssignmentValidation {
    static readonly CREATE: ZodType = z.object({
        title: z.string().min(5),
        description: z.string().min(10),
        maxScore: z.number().min(0).max(100).nonnegative(),
        dueDate: z.preprocess(
        (val) => (typeof val === "string" ? new Date(val) : val),
        z.date()
        )
    })

    static readonly UPDATE: ZodType = z.object({
        title: z.string().min(5).optional(),
        description: z.string().min(10).optional(),
        maxScore: z.number().min(0).max(100).optional(),
        dueDate: z.preprocess(
        (val) => (typeof val === "string" ? new Date(val) : val),
        z.date().optional()
        )
    })
}
