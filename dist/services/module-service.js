"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleService = void 0;
const module_model_1 = require("../models/module-model");
const validation_1 = require("../util/validation/validation");
const module_validation_1 = require("../util/validation/module-validation");
const database_1 = require("../app/database");
const error_1 = require("../util/error/error");
class ModuleService {
    static create(user, courseId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield database_1.prismaClient.course.findFirst({
                where: {
                    id: courseId,
                    authorId: user.id
                }
            });
            if (!course) {
                throw new error_1.ResponseError(400, "You are not authorized to create module for this course");
            }
            const createRequest = validation_1.Validation.validate(module_validation_1.ModuleValidation.CREATE, request);
            const existingModule = yield database_1.prismaClient.module.findFirst({
                where: {
                    courseId: course.id,
                    OR: [
                        { title: createRequest.title },
                        { order: createRequest.order },
                    ]
                }
            });
            if (existingModule) {
                if (existingModule.title === createRequest.title) {
                    throw new error_1.ResponseError(400, "Module with this title already exists");
                }
                else {
                    throw new error_1.ResponseError(400, "Module with this order already exists");
                }
            }
            const recordData = Object.assign(Object.assign({}, createRequest), { courseId: course.id });
            const createResponse = yield database_1.prismaClient.module.create({
                data: recordData
            });
            return (0, module_model_1.toModuleResponse)(createResponse);
        });
    }
    static get(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const module = yield database_1.prismaClient.module.findFirst({
                where: { id },
                include: {
                    course: {
                        select: {
                            authorId: true
                        }
                    }
                }
            });
            if (!module) {
                throw new error_1.ResponseError(404, "Module not found");
            }
            if (user.role === "INSTRUCTOR" && ((_a = module.course) === null || _a === void 0 ? void 0 : _a.authorId) !== user.id) {
                throw new error_1.ResponseError(403, "You are not authorized to access this module");
            }
            return (0, module_model_1.toModuleResponse)(module);
        });
    }
    static getAll(user, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const modules = yield database_1.prismaClient.module.findMany({
                where: { courseId },
                include: {
                    course: {
                        select: {
                            authorId: true
                        }
                    }
                },
                orderBy: { order: 'asc' }
            });
            if (user.role === "INSTRUCTOR") {
                return modules
                    .filter(module => { var _a; return ((_a = module.course) === null || _a === void 0 ? void 0 : _a.authorId) === user.id; })
                    .map(module_model_1.toModuleResponse);
            }
            return modules.map(module_model_1.toModuleResponse);
        });
    }
    static update(user, id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const module = yield database_1.prismaClient.module.findFirst({
                where: { id },
                include: {
                    course: {
                        select: {
                            authorId: true
                        }
                    }
                }
            });
            if (!module) {
                throw new error_1.ResponseError(404, "Module not found");
            }
            if (user.role !== "ADMIN" && (user.role === "INSTRUCTOR" && ((_a = module.course) === null || _a === void 0 ? void 0 : _a.authorId) !== user.id)) {
                throw new error_1.ResponseError(403, "You are not authorized to update this module");
            }
            const updateRequest = validation_1.Validation.validate(module_validation_1.ModuleValidation.UPDATE, request);
            if (updateRequest.order) {
                const existingOrder = yield database_1.prismaClient.module.findFirst({
                    where: {
                        courseId: module.courseId,
                        order: updateRequest.order,
                        id: { not: id }
                    }
                });
                if (existingOrder) {
                    throw new error_1.ResponseError(400, "Module order already exists in this course");
                }
            }
            const updateResponse = yield database_1.prismaClient.module.update({
                where: { id },
                data: updateRequest
            });
            return (0, module_model_1.toModuleResponse)(updateResponse);
        });
    }
    static delete(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const module = yield database_1.prismaClient.module.findFirst({
                where: { id },
                include: {
                    course: {
                        select: {
                            authorId: true
                        }
                    }
                }
            });
            if (!module) {
                throw new error_1.ResponseError(404, "Module not found");
            }
            if (user.role !== "ADMIN" && (user.role === "INSTRUCTOR" && ((_a = module.course) === null || _a === void 0 ? void 0 : _a.authorId) !== user.id)) {
                throw new error_1.ResponseError(403, "You are not authorized to delete this module");
            }
            const deleteResponse = yield database_1.prismaClient.module.delete({
                where: { id }
            });
            return (0, module_model_1.toModuleResponse)(deleteResponse);
        });
    }
}
exports.ModuleService = ModuleService;
