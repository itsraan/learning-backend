import { ZodType, z } from "zod"
import { UserRole } from "@prisma/client"

export class UserValidation {
    static readonly REGISTER: ZodType = z.object({
        username: z.string().min(1).max(100),
        email: z.string().email().max(100),
        password: z.string().min(4).max(20),
        role: z.nativeEnum(UserRole).optional()
    })

    static readonly LOGIN: ZodType = z.object({
        email: z.string().email().max(100),
        password: z.string().min(4).max(20)
    })

    static readonly UPDATE: ZodType = z.object({
        username: z.string().min(1).max(100).optional(),
        password: z.string().min(4).max(20).optional()
    })
}