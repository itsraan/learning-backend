"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseValidation = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
class CourseValidation {
}
exports.CourseValidation = CourseValidation;
CourseValidation.CREATE = zod_1.z.object({
    title: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().min(1).max(1000),
    category: zod_1.z.string().min(1).max(100),
    level: zod_1.z.nativeEnum(client_1.CourseLevel),
    price: zod_1.z.number().min(1),
    coverImage: zod_1.z.string().max(1000).optional()
});
CourseValidation.UPDATE = zod_1.z.object({
    title: zod_1.z.string().min(1).max(100).optional(),
    description: zod_1.z.string().min(1).max(1000).optional(),
    category: zod_1.z.string().min(1).max(100).optional(),
    level: zod_1.z.nativeEnum(client_1.CourseLevel).optional(),
    price: zod_1.z.number().min(1).optional(),
    coverImage: zod_1.z.string().max(1000).optional()
});
