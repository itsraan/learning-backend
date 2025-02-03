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
exports.ProgressService = void 0;
const progress_model_1 = require("../models/progress-model");
const validation_1 = require("../util/validation/validation");
const progress_validation_1 = require("../util/validation/progress-validation");
const database_1 = require("../app/database");
const error_1 = require("../util/error/error");
class ProgressService {
    static create(user, courseId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield database_1.prismaClient.course.findFirst({
                where: {
                    id: courseId,
                    enrollments: {
                        some: { userId: user.id }
                    }
                }
            });
            if (!course) {
                throw new error_1.ResponseError(400, "Course tidak ditemukan atau Anda tidak terdaftar di kursus ini");
            }
            const existingProgress = yield database_1.prismaClient.courseProgress.findFirst({
                where: {
                    courseId: courseId,
                    userId: user.id
                }
            });
            if (existingProgress) {
                throw new error_1.ResponseError(400, "Progress sudah ada untuk kursus ini");
            }
            const createRequest = validation_1.Validation.validate(progress_validation_1.ProgressValidation.CREATE, request);
            const createResponse = yield database_1.prismaClient.courseProgress.create({
                data: Object.assign(Object.assign({}, createRequest), { userId: user.id, courseId: course.id }),
                include: {
                    course: true,
                    user: true
                }
            });
            return (0, progress_model_1.toProgressResponse)(createResponse);
        });
    }
    static get(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const progress = yield database_1.prismaClient.courseProgress.findFirst({
                where: {
                    id,
                    userId: user.id
                },
                include: {
                    course: true,
                    user: true
                }
            });
            if (!progress) {
                throw new error_1.ResponseError(404, "Progress tidak ditemukan");
            }
            return (0, progress_model_1.toProgressResponse)(progress);
        });
    }
    static getAll(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const progresses = yield database_1.prismaClient.courseProgress.findMany({
                where: {
                    userId: user.id
                },
                include: {
                    course: true,
                    user: true
                },
                orderBy: {
                    lastAccessedAt: 'desc'
                }
            });
            return progresses.map(progress_model_1.toProgressResponse);
        });
    }
    static getAllByCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const progresses = yield database_1.prismaClient.courseProgress.findMany({
                where: {
                    courseId
                },
                include: {
                    course: true,
                    user: true
                },
                orderBy: {
                    lastAccessedAt: 'desc'
                }
            });
            return progresses.map(progress_model_1.toProgressResponse);
        });
    }
    static update(user, id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const progress = yield database_1.prismaClient.courseProgress.findFirst({
                where: {
                    id,
                    userId: user.id
                },
                include: {
                    course: true,
                    user: true
                }
            });
            if (!progress) {
                throw new error_1.ResponseError(404, "Progress tidak ditemukan");
            }
            const updateRequest = validation_1.Validation.validate(progress_validation_1.ProgressValidation.UPDATE, request);
            const updateResponse = yield database_1.prismaClient.courseProgress.update({
                where: { id },
                data: updateRequest,
                include: {
                    course: true,
                    user: true
                }
            });
            return (0, progress_model_1.toProgressResponse)(updateResponse);
        });
    }
    static delete(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const progress = yield database_1.prismaClient.courseProgress.findFirst({
                where: {
                    id,
                    userId: user.id
                },
                include: {
                    course: true,
                    user: true
                }
            });
            if (!progress) {
                throw new error_1.ResponseError(404, "Progress tidak ditemukan");
            }
            const deleteResponse = yield database_1.prismaClient.courseProgress.delete({
                where: { id },
                include: {
                    course: true,
                    user: true
                }
            });
            return (0, progress_model_1.toProgressResponse)(deleteResponse);
        });
    }
}
exports.ProgressService = ProgressService;
