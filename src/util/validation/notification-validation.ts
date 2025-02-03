import { ZodType, z } from "zod"
import { NotificationType } from "@prisma/client"

export class NotificationValidation {
    static readonly CREATE: ZodType = z.object({
        message: z.string().min(1).max(1000),
        type: z.nativeEnum(NotificationType),
        isRead: z.boolean().default(false)
    })

    static readonly UPDATE: ZodType = z.object({
        message: z.string().min(1).max(1000).optional(),
        type: z.nativeEnum(NotificationType).optional(),
        isRead: z.boolean().default(false).optional()
    })
}