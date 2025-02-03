"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentValidation = void 0;
const zod_1 = require("zod");
class AssignmentValidation {
}
exports.AssignmentValidation = AssignmentValidation;
AssignmentValidation.CREATE = zod_1.z.object({
    title: zod_1.z.string().min(5),
    description: zod_1.z.string().min(10),
    maxScore: zod_1.z.number().min(0).max(100).nonnegative(),
    dueDate: zod_1.z.preprocess((val) => (typeof val === "string" ? new Date(val) : val), zod_1.z.date())
});
AssignmentValidation.UPDATE = zod_1.z.object({
    title: zod_1.z.string().min(5).optional(),
    description: zod_1.z.string().min(10).optional(),
    maxScore: zod_1.z.number().min(0).max(100).optional(),
    dueDate: zod_1.z.preprocess((val) => (typeof val === "string" ? new Date(val) : val), zod_1.z.date().optional())
});
