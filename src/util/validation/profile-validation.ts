import { ZodType, z } from "zod"

export class ProfileValidation {
    static readonly CREATE: ZodType = z.object({
        firstName: z.string().min(1).max(100).regex(/^[a-zA-Z\s]+$/),
        lastName: z.string().min(1).max(100).regex(/^[a-zA-Z\s]+$/),
        bio: z.string().max(1000).optional(),
        profilePicture: z.string().max(1000).optional(),
        dateOfBirth: z.preprocess(
            (val) => (typeof val === "string" ? new Date(val) : val),
            z.date().optional()
            ),
        location: z.string().max(100).optional()
    })

    static readonly UPDATE: ZodType = z.object({
        id: z.string().min(1),
        firstName: z.string().min(1).max(100).regex(/^[a-zA-Z\s]+$/).optional(),
        lastName: z.string().min(1).max(100).regex(/^[a-zA-Z\s]+$/).optional(),
        bio: z.string().max(1000).optional(),
        profilePicture: z.string().max(1000).optional(),
        dateOfBirth: z.preprocess(
            (val) => (typeof val === "string" ? new Date(val) : val),
            z.date().optional()
            ),
        location: z.string().max(100).optional()
    })
}