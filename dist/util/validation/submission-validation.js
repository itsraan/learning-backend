"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionValidation = void 0;
const zod_1 = require("zod");
class SubmissionValidation {
}
exports.SubmissionValidation = SubmissionValidation;
SubmissionValidation.CREATE = zod_1.z.object({
    content: zod_1.z.string().min(1).max(1000).regex(/^[A-Za-z0-9\s,.'-]+$/)
});
SubmissionValidation.UPDATE = zod_1.z.object({
    grade: zod_1.z.number().min(0).max(100).optional()
});
