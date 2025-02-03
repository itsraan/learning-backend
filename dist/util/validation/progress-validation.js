"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressValidation = void 0;
const zod_1 = require("zod");
class ProgressValidation {
}
exports.ProgressValidation = ProgressValidation;
ProgressValidation.CREATE = zod_1.z.object({
    completedLessons: zod_1.z.string().min(1).max(100).optional(),
    progress: zod_1.z.number().min(0).max(100)
});
ProgressValidation.UPDATE = zod_1.z.object({
    completedLessons: zod_1.z.string().min(1).max(100).optional(),
    progress: zod_1.z.number().min(0).max(100).optional()
});
