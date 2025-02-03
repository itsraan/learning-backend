"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationValidation = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
class NotificationValidation {
}
exports.NotificationValidation = NotificationValidation;
NotificationValidation.CREATE = zod_1.z.object({
    message: zod_1.z.string().min(1).max(1000),
    type: zod_1.z.nativeEnum(client_1.NotificationType),
    isRead: zod_1.z.boolean().default(false)
});
NotificationValidation.UPDATE = zod_1.z.object({
    message: zod_1.z.string().min(1).max(1000).optional(),
    type: zod_1.z.nativeEnum(client_1.NotificationType).optional(),
    isRead: zod_1.z.boolean().default(false).optional()
});
