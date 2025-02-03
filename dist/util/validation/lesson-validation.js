"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonValidation = void 0;
const zod_1 = require("zod");
class LessonValidation {
}
exports.LessonValidation = LessonValidation;
LessonValidation.CREATE = zod_1.z.object({
    title: zod_1.z.string().min(1).max(100),
    content: zod_1.z.string().min(1).max(1000),
    videoUrl: zod_1.z.string().min(1).max(100).optional(),
    resourceUrls: zod_1.z.string().min(1).max(100).optional(),
    order: zod_1.z.number().min(1)
});
LessonValidation.UPDATE = zod_1.z.object({
    title: zod_1.z.string().min(1).max(100).optional(),
    content: zod_1.z.string().min(1).max(1000).optional(),
    videoUrl: zod_1.z.string().min(1).max(100).optional(),
    resourceUrls: zod_1.z.string().min(1).max(100).optional(),
    order: zod_1.z.number().min(1).optional()
});
