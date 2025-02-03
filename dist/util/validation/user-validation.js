"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
class UserValidation {
}
exports.UserValidation = UserValidation;
UserValidation.REGISTER = zod_1.z.object({
    username: zod_1.z.string().min(1).max(100),
    email: zod_1.z.string().email().max(100),
    password: zod_1.z.string().min(4).max(20),
    role: zod_1.z.nativeEnum(client_1.UserRole).optional()
});
UserValidation.LOGIN = zod_1.z.object({
    email: zod_1.z.string().email().max(100),
    password: zod_1.z.string().min(4).max(20)
});
UserValidation.UPDATE = zod_1.z.object({
    username: zod_1.z.string().min(1).max(100).optional(),
    password: zod_1.z.string().min(4).max(20).optional()
});
