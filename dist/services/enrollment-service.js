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
exports.EnrollmentService = void 0;
const enrollment_model_1 = require("../models/enrollment-model");
const validation_1 = require("../util/validation/validation");
const enrollment_validation_1 = require("../util/validation/enrollment-validation");
const database_1 = require("../app/database");
const error_1 = require("../util/error/error");
class EnrollmentService {
    static create(user, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield database_1.prismaClient.course.findFirst({
                where: {
                    id: courseId,
                    NOT: {
                        authorId: user.id
                    }
                }
            });
            if (!course) {
                throw new error_1.ResponseError(400, "Course not found or you cannot enroll in your own course");
            }
            const existingEnrollment = yield database_1.prismaClient.enrollment.findFirst({
                where: {
                    userId: user.id,
                    courseId: course.id
                }
            });
            if (existingEnrollment) {
                throw new error_1.ResponseError(400, "You are already enrolled in this course");
            }
            const createResponse = yield database_1.prismaClient.enrollment.create({
                data: {
                    userId: user.id,
                    courseId: course.id
                },
                include: {
                    user: true,
                    course: true
                }
            });
            return (0, enrollment_model_1.toEnrollmentResponse)(createResponse);
        });
    }
    static get(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const enrollment = yield database_1.prismaClient.enrollment.findFirst({
                where: {
                    id,
                    userId: user.id
                },
                include: {
                    user: true,
                    course: true
                }
            });
            if (!enrollment) {
                throw new error_1.ResponseError(404, "Enrollment not found");
            }
            return (0, enrollment_model_1.toEnrollmentResponse)(enrollment);
        });
    }
    static getAll(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const enrollments = yield database_1.prismaClient.enrollment.findMany({
                where: {
                    userId: user.id
                },
                include: {
                    user: true,
                    course: true
                },
                orderBy: {
                    enrolledAt: 'desc'
                }
            });
            return enrollments.map(enrollment_model_1.toEnrollmentResponse);
        });
    }
    static getAllByCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const enrollments = yield database_1.prismaClient.enrollment.findMany({
                where: {
                    courseId
                },
                include: {
                    user: true,
                    course: true
                },
                orderBy: {
                    enrolledAt: 'desc'
                }
            });
            return enrollments.map(enrollment_model_1.toEnrollmentResponse);
        });
    }
    static update(user, id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const enrollment = yield database_1.prismaClient.enrollment.findFirst({
                where: {
                    id,
                    userId: user.id
                },
                include: {
                    user: true,
                    course: true
                }
            });
            if (!enrollment) {
                throw new error_1.ResponseError(404, "Enrollment not found");
            }
            const updateRequest = validation_1.Validation.validate(enrollment_validation_1.EnrollmentValidation.UPDATE, request);
            const updateResponse = yield database_1.prismaClient.enrollment.update({
                where: { id },
                data: updateRequest,
                include: {
                    user: true,
                    course: true
                }
            });
            return (0, enrollment_model_1.toEnrollmentResponse)(updateResponse);
        });
    }
    static delete(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const enrollment = yield database_1.prismaClient.enrollment.findFirst({
                where: {
                    id,
                    userId: user.id
                },
                include: {
                    user: true,
                    course: true
                }
            });
            if (!enrollment) {
                throw new error_1.ResponseError(404, "Enrollment not found");
            }
            const deleteResponse = yield database_1.prismaClient.enrollment.delete({
                where: { id },
                include: {
                    user: true,
                    course: true
                }
            });
            return (0, enrollment_model_1.toEnrollmentResponse)(deleteResponse);
        });
    }
}
exports.EnrollmentService = EnrollmentService;
