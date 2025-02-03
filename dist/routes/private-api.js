"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateApi = void 0;
const user_controller_1 = require("../controllers/user-controller");
const profile_controller_1 = require("../controllers/profile-controller");
const course_controller_1 = require("../controllers/course-controller");
const module_controller_1 = require("../controllers/module-controller");
const lesson_controller_1 = require("../controllers/lesson-controller");
const enrollment_controller_1 = require("../controllers/enrollment-controller");
const assignment_controller_1 = require("../controllers/assignment-controller");
const submission_controller_1 = require("../controllers/submission-controller");
const progress_controller_1 = require("../controllers/progress-controller");
const notification_controller_1 = require("../controllers/notification-controller");
const profile_service_1 = require("../services/profile-service");
const course_service_1 = require("../services/course-service");
const auth_middleware_1 = require("../middleware/auth-middleware");
const auth_middleware_2 = require("../middleware/auth-middleware");
const express_1 = __importDefault(require("express"));
exports.privateApi = express_1.default.Router();
exports.privateApi.use(auth_middleware_1.authMiddleware);
// User routes
exports.privateApi.route("/api/users")
    .get(user_controller_1.UserController.get)
    .patch(user_controller_1.UserController.update);
exports.privateApi.route("/api/user/:id?")
    .delete((0, auth_middleware_2.authorizeRole)(["ADMIN", ""]), user_controller_1.UserController.delete);
exports.privateApi.route("/api/allusers")
    .get((0, auth_middleware_2.authorizeRole)(["ADMIN", ""]), user_controller_1.UserController.getAll);
exports.privateApi.route("/api/logout")
    .delete(user_controller_1.UserController.logout);
// Profile routes
exports.privateApi.route("/api/profile/upload-picture")
    .post((0, auth_middleware_2.authorizeRole)(["STUDENT", "INSTRUCTOR", "ADMIN"]), profile_service_1.ProfileService.uploadMiddleware, profile_controller_1.ProfileController.uploadPicture);
exports.privateApi.route("/api/profile/:id?")
    .post((0, auth_middleware_2.authorizeRole)(["STUDENT", "INSTRUCTOR", "ADMIN"]), profile_controller_1.ProfileController.create)
    .get((0, auth_middleware_2.authorizeRole)(["STUDENT", "INSTRUCTOR", "ADMIN"]), profile_controller_1.ProfileController.get)
    .patch((0, auth_middleware_2.authorizeRole)(["STUDENT", "INSTRUCTOR", "ADMIN"]), profile_controller_1.ProfileController.update)
    .delete((0, auth_middleware_2.authorizeRole)(["STUDENT", "INSTRUCTOR", "ADMIN"]), profile_controller_1.ProfileController.delete);
// Course routes
exports.privateApi.route("/api/course/upload-cover-image")
    .post((0, auth_middleware_2.authorizeRole)(["INSTRUCTOR", "ADMIN"]), course_service_1.CourseService.uploadMiddleware, course_controller_1.CourseController.uploadPicture);
exports.privateApi.route("/api/courses")
    .get(course_controller_1.CourseController.getAll);
exports.privateApi.route("/api/course/:id?")
    .post((0, auth_middleware_2.authorizeRole)(["INSTRUCTOR", "ADMIN"]), course_controller_1.CourseController.create)
    .get((0, auth_middleware_2.authorizeRole)(["STUDENT", "INSTRUCTOR", "ADMIN"]), course_controller_1.CourseController.get)
    .patch((0, auth_middleware_2.authorizeRole)(["INSTRUCTOR", "ADMIN"]), course_controller_1.CourseController.update)
    .delete((0, auth_middleware_2.authorizeRole)(["INSTRUCTOR", "ADMIN"]), course_controller_1.CourseController.delete);
// Module routes
exports.privateApi.route("/api/course/:id/module")
    .post((0, auth_middleware_2.authorizeRole)(["INSTRUCTOR", "ADMIN"]), module_controller_1.ModuleController.create)
    .get(module_controller_1.ModuleController.getAll);
exports.privateApi.route("/api/module/:id")
    .get(module_controller_1.ModuleController.get)
    .patch((0, auth_middleware_2.authorizeRole)(["INSTRUCTOR", "ADMIN"]), module_controller_1.ModuleController.update)
    .delete((0, auth_middleware_2.authorizeRole)(["INSTRUCTOR", "ADMIN"]), module_controller_1.ModuleController.delete);
// Lesson routes
exports.privateApi.route("/api/module/:id/lesson")
    .post((0, auth_middleware_2.authorizeRole)(["INSTRUCTOR", "ADMIN"]), lesson_controller_1.LessonController.create)
    .get(lesson_controller_1.LessonController.getAll);
exports.privateApi.route("/api/lesson/:id")
    .get(lesson_controller_1.LessonController.get)
    .patch((0, auth_middleware_2.authorizeRole)(["INSTRUCTOR", "ADMIN"]), lesson_controller_1.LessonController.update)
    .delete((0, auth_middleware_2.authorizeRole)(["INSTRUCTOR", "ADMIN"]), lesson_controller_1.LessonController.delete);
// Enrollment routes
exports.privateApi.route("/api/course/:id/enroll")
    .post((0, auth_middleware_2.authorizeRole)(["STUDENT", "ADMIN"]), enrollment_controller_1.EnrollmentController.create);
exports.privateApi.route("/api/enrollments/bycourse/:id")
    .get((0, auth_middleware_2.authorizeRole)(["STUDENT", "INSTRUCTOR", "ADMIN"]), enrollment_controller_1.EnrollmentController.getAllByCourse);
exports.privateApi.route("/api/enrollments")
    .get((0, auth_middleware_2.authorizeRole)(["STUDENT", "INSTRUCTOR", "ADMIN"]), enrollment_controller_1.EnrollmentController.getAll);
exports.privateApi.route("/api/enrollment/:id")
    .get((0, auth_middleware_2.authorizeRole)(["STUDENT", "INSTRUCTOR", "ADMIN"]), enrollment_controller_1.EnrollmentController.get)
    .patch((0, auth_middleware_2.authorizeRole)(["STUDENT", "INSTRUCTOR", "ADMIN"]), enrollment_controller_1.EnrollmentController.update)
    .delete((0, auth_middleware_2.authorizeRole)(["STUDENT", "INSTRUCTOR", "ADMIN"]), enrollment_controller_1.EnrollmentController.delete);
// Assignment routes
exports.privateApi.route("/api/lesson/:id/assignment")
    .post((0, auth_middleware_2.authorizeRole)(["INSTRUCTOR", "ADMIN"]), assignment_controller_1.AssignmentController.create);
exports.privateApi.route("/api/assignments")
    .get((0, auth_middleware_2.authorizeRole)(["STUDENT", "INSTRUCTOR", "ADMIN"]), assignment_controller_1.AssignmentController.getAll);
exports.privateApi.route("/api/assignment/:id")
    .get((0, auth_middleware_2.authorizeRole)(["STUDENT", "INSTRUCTOR", "ADMIN"]), assignment_controller_1.AssignmentController.get)
    .patch((0, auth_middleware_2.authorizeRole)(["INSTRUCTOR", "ADMIN"]), assignment_controller_1.AssignmentController.update)
    .delete((0, auth_middleware_2.authorizeRole)(["INSTRUCTOR", "ADMIN"]), assignment_controller_1.AssignmentController.delete);
exports.privateApi.route("/api/assignments/bylesson/:id")
    .get((0, auth_middleware_2.authorizeRole)(["STUDENT", "INSTRUCTOR", "ADMIN"]), assignment_controller_1.AssignmentController.getAllByLesson);
// Submission routes
exports.privateApi.route("/api/assignment/:id/submission")
    .post((0, auth_middleware_2.authorizeRole)(["STUDENT", "ADMIN"]), submission_controller_1.SubmissionController.create);
exports.privateApi.route("/api/submissions")
    .get((0, auth_middleware_2.authorizeRole)(["STUDENT", "INSTRUCTOR", "ADMIN"]), submission_controller_1.SubmissionController.getAll);
exports.privateApi.route("/api/submission/:id")
    .get((0, auth_middleware_2.authorizeRole)(["STUDENT", "INSTRUCTOR", "ADMIN"]), submission_controller_1.SubmissionController.get)
    .patch((0, auth_middleware_2.authorizeRole)(["INSTRUCTOR", "ADMIN"]), submission_controller_1.SubmissionController.update)
    .delete((0, auth_middleware_2.authorizeRole)(["", "ADMIN"]), submission_controller_1.SubmissionController.delete);
exports.privateApi.route("/api/submissions/byassignment/:id")
    .get((0, auth_middleware_2.authorizeRole)(["STUDENT", "INSTRUCTOR", "ADMIN"]), submission_controller_1.SubmissionController.getAllBySubmission);
// Progress routes
exports.privateApi.route("/api/course/:id/progress")
    .post((0, auth_middleware_2.authorizeRole)(["STUDENT", "ADMIN"]), progress_controller_1.ProgressController.create);
exports.privateApi.route("/api/progress")
    .get((0, auth_middleware_2.authorizeRole)(["STUDENT", "INSTRUCTOR", "ADMIN"]), progress_controller_1.ProgressController.getAll);
exports.privateApi.route("/api/progress/:id")
    .get((0, auth_middleware_2.authorizeRole)(["STUDENT", "INSTRUCTOR", "ADMIN"]), progress_controller_1.ProgressController.get)
    .patch((0, auth_middleware_2.authorizeRole)(["STUDENT", "INSTRUCTOR", "ADMIN"]), progress_controller_1.ProgressController.update)
    .delete((0, auth_middleware_2.authorizeRole)(["STUDENT", "INSTRUCTOR", "ADMIN"]), progress_controller_1.ProgressController.delete);
exports.privateApi.route("/api/courses/:id/progress")
    .get((0, auth_middleware_2.authorizeRole)(["STUDENT", "INSTRUCTOR", "ADMIN"]), progress_controller_1.ProgressController.getAllByCourse);
// Notification routes
exports.privateApi.route("/api/notifications")
    .post((0, auth_middleware_2.authorizeRole)(["STUDENT", "INSTRUCTOR", "ADMIN"]), notification_controller_1.NotificationController.create)
    .get((0, auth_middleware_2.authorizeRole)(["STUDENT", "INSTRUCTOR", "ADMIN"]), notification_controller_1.NotificationController.getAll)
    .delete((0, auth_middleware_2.authorizeRole)(["STUDENT", "INSTRUCTOR", "ADMIN"]), notification_controller_1.NotificationController.deleteAll);
exports.privateApi.route("/api/notifications/unread")
    .get((0, auth_middleware_2.authorizeRole)(["STUDENT", "INSTRUCTOR", "ADMIN"]), notification_controller_1.NotificationController.getUnread);
exports.privateApi.route("/api/notifications/read-all")
    .post((0, auth_middleware_2.authorizeRole)(["STUDENT", "INSTRUCTOR", "ADMIN"]), notification_controller_1.NotificationController.markAllAsRead);
exports.privateApi.route("/api/notifications/:id")
    .get((0, auth_middleware_2.authorizeRole)(["STUDENT", "INSTRUCTOR", "ADMIN"]), notification_controller_1.NotificationController.get)
    .patch((0, auth_middleware_2.authorizeRole)(["STUDENT", "INSTRUCTOR", "ADMIN"]), notification_controller_1.NotificationController.update)
    .delete((0, auth_middleware_2.authorizeRole)(["STUDENT", "INSTRUCTOR", "ADMIN"]), notification_controller_1.NotificationController.delete);
exports.privateApi.route("/api/notifications/:id/read")
    .post((0, auth_middleware_2.authorizeRole)(["STUDENT", "INSTRUCTOR", "ADMIN"]), notification_controller_1.NotificationController.markAsRead);
