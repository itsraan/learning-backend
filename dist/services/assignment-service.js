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
exports.AssignmentService = void 0;
const assignment_model_1 = require("../models/assignment-model");
const validation_1 = require("../util/validation/validation");
const assignment_validation_1 = require("../util/validation/assignment-validation");
const database_1 = require("../app/database");
const error_1 = require("../util/error/error");
class AssignmentService {
    static create(user, lessonId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const lesson = yield database_1.prismaClient.lesson.findFirst({
                where: {
                    id: lessonId,
                    module: {
                        course: {
                            authorId: user.id
                        }
                    }
                }
            });
            if (!lesson) {
                throw new error_1.ResponseError(400, "Lesson tidak ditemukan atau Anda tidak memiliki akses");
            }
            const existingAssignment = yield database_1.prismaClient.assignment.findFirst({
                where: {
                    lessonId: lesson.id
                }
            });
            if (existingAssignment) {
                throw new error_1.ResponseError(400, "Assignment sudah ada untuk lesson ini");
            }
            const createRequest = validation_1.Validation.validate(assignment_validation_1.AssignmentValidation.CREATE, request);
            const createResponse = yield database_1.prismaClient.assignment.create({
                data: Object.assign(Object.assign(Object.assign({}, createRequest), { lessonId: lesson.id }), { authorId: user.id }),
                include: {
                    lesson: true,
                    author: true
                }
            });
            return (0, assignment_model_1.toAssignmentResponse)(createResponse);
        });
    }
    static get(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const assignment = yield database_1.prismaClient.assignment.findFirst({
                where: {
                    id,
                    authorId: user.id
                },
                include: {
                    lesson: true,
                    author: true
                }
            });
            if (!assignment) {
                throw new error_1.ResponseError(404, "Assignment tidak ditemukan");
            }
            return (0, assignment_model_1.toAssignmentResponse)(assignment);
        });
    }
    static getAll(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const assignments = yield database_1.prismaClient.assignment.findMany({
                where: {
                    authorId: user.id
                },
                include: {
                    lesson: true,
                    author: true
                },
                orderBy: {
                    dueDate: 'desc'
                }
            });
            return assignments.map(assignment_model_1.toAssignmentResponse);
        });
    }
    static getAllByLesson(lessonId) {
        return __awaiter(this, void 0, void 0, function* () {
            const assignments = yield database_1.prismaClient.assignment.findMany({
                where: {
                    lessonId
                },
                include: {
                    lesson: true,
                    author: true
                },
                orderBy: {
                    dueDate: 'desc'
                }
            });
            return assignments.map(assignment_model_1.toAssignmentResponse);
        });
    }
    static update(user, id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const assignment = yield database_1.prismaClient.assignment.findFirst({
                where: {
                    id,
                    authorId: user.id
                },
                include: {
                    lesson: true,
                    author: true
                }
            });
            if (!assignment) {
                throw new error_1.ResponseError(404, "Assignment tidak ditemukan");
            }
            const updateRequest = validation_1.Validation.validate(assignment_validation_1.AssignmentValidation.UPDATE, request);
            const updateResponse = yield database_1.prismaClient.assignment.update({
                where: { id },
                data: updateRequest,
                include: {
                    lesson: true,
                    author: true
                }
            });
            return (0, assignment_model_1.toAssignmentResponse)(updateResponse);
        });
    }
    static delete(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const assignment = yield database_1.prismaClient.assignment.findFirst({
                where: {
                    id,
                    authorId: user.id
                },
                include: {
                    lesson: true,
                    author: true
                }
            });
            if (!assignment) {
                throw new error_1.ResponseError(404, "Assignment tidak ditemukan");
            }
            const deleteResponse = yield database_1.prismaClient.assignment.delete({
                where: { id },
                include: {
                    lesson: true,
                    author: true
                }
            });
            return (0, assignment_model_1.toAssignmentResponse)(deleteResponse);
        });
    }
}
exports.AssignmentService = AssignmentService;
