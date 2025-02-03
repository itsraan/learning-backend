"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleValidation = void 0;
const zod_1 = require("zod");
class ModuleValidation {
}
exports.ModuleValidation = ModuleValidation;
ModuleValidation.CREATE = zod_1.z.object({
    title: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().min(1).max(1000),
    order: zod_1.z.number().min(1)
});
ModuleValidation.UPDATE = zod_1.z.object({
    title: zod_1.z.string().min(1).max(100).optional(),
    description: zod_1.z.string().min(1).max(1000).optional(),
    order: zod_1.z.number().min(1).optional()
});
