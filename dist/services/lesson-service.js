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
exports.LessonService = void 0;
const lesson_model_1 = require("../models/lesson-model");
const validation_1 = require("../util/validation/validation");
const lesson_validation_1 = require("../util/validation/lesson-validation");
const database_1 = require("../app/database");
const error_1 = require("../util/error/error");
class LessonService {
    static create(user, moduleId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const module = yield database_1.prismaClient.module.findFirst({
                where: {
                    id: moduleId,
                    course: {
                        authorId: user.id
                    }
                }
            });
            if (!module) {
                throw new error_1.ResponseError(400, "You are not authorized to create lesson for this module");
            }
            const createRequest = validation_1.Validation.validate(lesson_validation_1.LessonValidation.CREATE, request);
            const existingLesson = yield database_1.prismaClient.lesson.findFirst({
                where: {
                    moduleId: module.id,
                    OR: [
                        { title: createRequest.title },
                        { order: createRequest.order }
                    ]
                }
            });
            if (existingLesson) {
                if (existingLesson.title === createRequest.title) {
                    throw new error_1.ResponseError(400, "Lesson with this title already exists");
                }
                else {
                    throw new error_1.ResponseError(400, "Lesson with this order already exists");
                }
            }
            const recordData = Object.assign(Object.assign({}, createRequest), { moduleId: module.id });
            const createResponse = yield database_1.prismaClient.lesson.create({
                data: recordData
            });
            return (0, lesson_model_1.toLessonResponse)(createResponse);
        });
    }
    static get(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const lesson = yield database_1.prismaClient.lesson.findUnique({
                where: {
                    id,
                    module: {
                        course: {
                            authorId: user.id
                        }
                    }
                }
            });
            if (!lesson) {
                throw new error_1.ResponseError(400, "Lesson not found");
            }
            return (0, lesson_model_1.toLessonResponse)(lesson);
        });
    }
    static getAll(user, moduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const module = yield database_1.prismaClient.module.findFirst({
                where: {
                    id: moduleId,
                    course: {
                        authorId: user.id
                    }
                }
            });
            if (!module) {
                throw new error_1.ResponseError(403, "You are not authorized to access this module");
            }
            const lessons = yield database_1.prismaClient.lesson.findMany({
                where: {
                    moduleId,
                    module: {
                        course: {
                            authorId: user.id
                        }
                    }
                },
                orderBy: {
                    order: 'asc',
                }
            });
            return lessons.map(lesson_model_1.toLessonResponse);
        });
    }
    static update(user, id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const lesson = yield database_1.prismaClient.lesson.findFirst({
                where: {
                    id,
                    module: {
                        course: {
                            authorId: user.id
                        }
                    }
                }
            });
            if (!lesson) {
                throw new error_1.ResponseError(400, "Lesson not found");
            }
            const updateRequest = validation_1.Validation.validate(lesson_validation_1.LessonValidation.UPDATE, request);
            if (updateRequest.order) {
                const existingOrder = yield database_1.prismaClient.lesson.findFirst({
                    where: {
                        moduleId: lesson.moduleId,
                        order: updateRequest.order,
                        id: { not: id }
                    }
                });
                if (existingOrder) {
                    throw new error_1.ResponseError(400, "Lesson order already exists in this module");
                }
            }
            const updateResponse = yield database_1.prismaClient.lesson.update({
                where: { id },
                data: updateRequest
            });
            return (0, lesson_model_1.toLessonResponse)(updateResponse);
        });
    }
    static delete(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const lesson = yield database_1.prismaClient.lesson.findUnique({
                where: {
                    id,
                    module: {
                        course: {
                            authorId: user.id
                        }
                    }
                }
            });
            if (!lesson) {
                throw new error_1.ResponseError(400, "Lesson not found");
            }
            const deleteResponse = yield database_1.prismaClient.lesson.delete({
                where: { id }
            });
            return (0, lesson_model_1.toLessonResponse)(deleteResponse);
        });
    }
}
exports.LessonService = LessonService;
