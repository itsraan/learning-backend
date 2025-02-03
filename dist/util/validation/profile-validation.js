"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileValidation = void 0;
const zod_1 = require("zod");
class ProfileValidation {
}
exports.ProfileValidation = ProfileValidation;
ProfileValidation.CREATE = zod_1.z.object({
    firstName: zod_1.z.string().min(1).max(100).regex(/^[a-zA-Z\s]+$/),
    lastName: zod_1.z.string().min(1).max(100).regex(/^[a-zA-Z\s]+$/),
    bio: zod_1.z.string().max(1000).optional(),
    profilePicture: zod_1.z.string().max(1000).optional(),
    dateOfBirth: zod_1.z.preprocess((val) => (typeof val === "string" ? new Date(val) : val), zod_1.z.date().optional()),
    location: zod_1.z.string().max(100).optional()
});
ProfileValidation.UPDATE = zod_1.z.object({
    id: zod_1.z.string().min(1),
    firstName: zod_1.z.string().min(1).max(100).regex(/^[a-zA-Z\s]+$/).optional(),
    lastName: zod_1.z.string().min(1).max(100).regex(/^[a-zA-Z\s]+$/).optional(),
    bio: zod_1.z.string().max(1000).optional(),
    profilePicture: zod_1.z.string().max(1000).optional(),
    dateOfBirth: zod_1.z.preprocess((val) => (typeof val === "string" ? new Date(val) : val), zod_1.z.date().optional()),
    location: zod_1.z.string().max(100).optional()
});
