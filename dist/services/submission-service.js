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
exports.SubmissionService = void 0;
const submission_model_1 = require("../models/submission-model");
const validation_1 = require("../util/validation/validation");
const submission_validation_1 = require("../util/validation/submission-validation");
const database_1 = require("../app/database");
const error_1 = require("../util/error/error");
class SubmissionService {
    static create(user, assignmentId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const assignment = yield database_1.prismaClient.assignment.findFirst({
                where: {
                    id: assignmentId,
                    lesson: {
                        module: {
                            course: {
                                enrollments: {
                                    some: { userId: user.id }
                                }
                            }
                        }
                    }
                }
            });
            if (!assignment) {
                throw new error_1.ResponseError(400, "Assignment tidak ditemukan atau Anda tidak terdaftar di kursus ini");
            }
            const existingSubmission = yield database_1.prismaClient.submission.findFirst({
                where: {
                    assignmentId: assignment.id,
                    userId: user.id
                }
            });
            if (existingSubmission) {
                throw new error_1.ResponseError(400, "Submission sudah ada untuk assignment ini");
            }
            const createRequest = validation_1.Validation.validate(submission_validation_1.SubmissionValidation.CREATE, request);
            const createResponse = yield database_1.prismaClient.submission.create({
                data: Object.assign(Object.assign({}, createRequest), { userId: user.id, assignmentId: assignment.id }),
                include: {
                    assignment: true,
                    user: true
                }
            });
            return (0, submission_model_1.toSubmissionResponse)(createResponse);
        });
    }
    static get(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const submission = yield database_1.prismaClient.submission.findFirst({
                where: {
                    id,
                    userId: user.id
                },
                include: {
                    assignment: true,
                    user: true
                }
            });
            if (!submission) {
                throw new error_1.ResponseError(404, "Submission tidak ditemukan");
            }
            return (0, submission_model_1.toSubmissionResponse)(submission);
        });
    }
    static getAll(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const submissions = yield database_1.prismaClient.submission.findMany({
                where: {
                    userId: user.id
                },
                include: {
                    assignment: true,
                    user: true
                },
                orderBy: {
                    submittedAt: 'desc'
                }
            });
            return submissions.map(submission_model_1.toSubmissionResponse);
        });
    }
    static getAllBySubmission(assignmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const submissions = yield database_1.prismaClient.submission.findMany({
                where: {
                    assignmentId
                },
                include: {
                    assignment: true,
                    user: true
                },
                orderBy: {
                    submittedAt: 'desc'
                }
            });
            return submissions.map(submission_model_1.toSubmissionResponse);
        });
    }
    static update(user, id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const submission = yield database_1.prismaClient.submission.findFirst({
                where: {
                    id,
                    userId: user.id
                },
                include: {
                    assignment: true,
                    user: true
                }
            });
            if (!submission) {
                throw new error_1.ResponseError(404, "Submission tidak ditemukan");
            }
            const updateRequest = validation_1.Validation.validate(submission_validation_1.SubmissionValidation.UPDATE, request);
            const updateResponse = yield database_1.prismaClient.submission.update({
                where: { id },
                data: updateRequest,
                include: {
                    assignment: true,
                    user: true
                }
            });
            return (0, submission_model_1.toSubmissionResponse)(updateResponse);
        });
    }
    static delete(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const submission = yield database_1.prismaClient.submission.findFirst({
                where: {
                    id,
                    userId: user.id
                },
                include: {
                    assignment: true,
                    user: true
                }
            });
            if (!submission) {
                throw new error_1.ResponseError(404, "Submission tidak ditemukan");
            }
            const deleteResponse = yield database_1.prismaClient.submission.delete({
                where: { id },
                include: {
                    assignment: true,
                    user: true
                }
            });
            return (0, submission_model_1.toSubmissionResponse)(deleteResponse);
        });
    }
}
exports.SubmissionService = SubmissionService;
