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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseService = void 0;
const course_model_1 = require("../models/course-model");
const validation_1 = require("../util/validation/validation");
const course_validation_1 = require("../util/validation/course-validation");
const database_1 = require("../app/database");
const error_1 = require("../util/error/error");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(__dirname, "../../public/images");
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}${path_1.default.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new error_1.ResponseError(400, 'Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false);
    }
};
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Batasan 5MB
    }
});
class CourseService {
    static create(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(course_validation_1.CourseValidation.CREATE, request);
            const existingCourse = yield database_1.prismaClient.course.findFirst({
                where: {
                    authorId: user.id,
                    title: createRequest.title
                }
            });
            if (existingCourse) {
                throw new error_1.ResponseError(400, "Course already exists");
            }
            const recordData = Object.assign(Object.assign({}, createRequest), { authorId: user.id });
            const createResponse = yield database_1.prismaClient.course.create({
                data: recordData
            });
            return (0, course_model_1.toCourseResponse)(createResponse);
        });
    }
    static checkCourseMustBeExists(userId, courseId, userRole) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                where: {
                    id: courseId
                }
            };
            if (userRole === "INSTRUCTOR") {
                query.where.authorId = userId;
            }
            const course = yield database_1.prismaClient.course.findFirst(query);
            if (!course) {
                throw new error_1.ResponseError(404, "Course not found");
            }
            if (userRole === "INSTRUCTOR" && course.authorId !== userId) {
                throw new error_1.ResponseError(403, "You don't have permission to access this course");
            }
            return course;
        });
    }
    static get(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.checkCourseMustBeExists(user.id, id, user.role);
            return (0, course_model_1.toCourseResponse)(course);
        });
    }
    static getAll(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                include: { author: true }
            };
            if (user.role === "INSTRUCTOR") {
                query.where = { authorId: user.id };
            }
            else if (user.role !== "ADMIN" && user.role !== "STUDENT") {
                throw new error_1.ResponseError(403, "Unauthorized role");
            }
            const courses = yield database_1.prismaClient.course.findMany(query);
            return courses.map(course_model_1.toCourseResponse);
        });
    }
    static update(user, id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateRequest = validation_1.Validation.validate(course_validation_1.CourseValidation.UPDATE, request);
            yield this.checkCourseMustBeExists(user.id, updateRequest.id, user.role);
            if (user.role !== "ADMIN" && (user.role !== "INSTRUCTOR" || updateRequest.id !== id)) {
                throw new error_1.ResponseError(403, "You don't have permission to update this course");
            }
            const updateData = Object.keys(updateRequest).reduce((data, key) => {
                if (updateRequest[key] !== undefined) {
                    data[key] = updateRequest[key];
                }
                return data;
            }, {});
            const updateResponse = yield database_1.prismaClient.course.update({
                where: { id },
                data: updateData
            });
            return (0, course_model_1.toCourseResponse)(updateResponse);
        });
    }
    static delete(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.checkCourseMustBeExists(user.id, id, user.role);
            if (user.role !== "ADMIN" && (user.role !== "INSTRUCTOR" || course.authorId !== user.id)) {
                throw new error_1.ResponseError(403, "You don't have permission to delete this course");
            }
            if (course === null || course === void 0 ? void 0 : course.coverImage) {
                const filePath = path_1.default.join(__dirname, '../../public/images', course.coverImage);
                if (fs_1.default.existsSync(filePath)) {
                    fs_1.default.unlinkSync(filePath);
                }
            }
            const deleteResponse = yield database_1.prismaClient.course.delete({
                where: { id }
            });
            return (0, course_model_1.toCourseResponse)(deleteResponse);
        });
    }
    static coverImage(user, file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!file) {
                throw new error_1.ResponseError(400, 'No file uploaded');
            }
            const course = yield database_1.prismaClient.course.findFirst({
                where: { authorId: user.id },
            });
            if (!course) {
                throw new error_1.ResponseError(404, 'Course not found');
            }
            if (course.coverImage) {
                const oldFilePath = path_1.default.join(__dirname, '../../public/images', course.coverImage);
                if (fs_1.default.existsSync(oldFilePath)) {
                    fs_1.default.unlinkSync(oldFilePath);
                }
            }
            const updatedCourse = yield database_1.prismaClient.course.update({
                where: { id: course.id },
                data: { coverImage: file.filename },
            });
            return (0, course_model_1.toCourseResponse)(updatedCourse);
        });
    }
}
exports.CourseService = CourseService;
CourseService.uploadMiddleware = upload.single('coverImage');
