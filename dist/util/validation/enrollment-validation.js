"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentValidation = void 0;
const zod_1 = require("zod");
class EnrollmentValidation {
}
exports.EnrollmentValidation = EnrollmentValidation;
EnrollmentValidation.UPDATE = zod_1.z.object({
    completedAt: zod_1.z.preprocess((val) => (typeof val === "string" ? new Date(val) : val), zod_1.z.date().optional())
});
