import { ZodType, z } from "zod"

export class EnrollmentValidation {
    static readonly UPDATE: ZodType = z.object({
        completedAt: z.preprocess(
            (val) => (typeof val === "string" ? new Date(val) : val),
            z.date().optional()
            )
    })
}