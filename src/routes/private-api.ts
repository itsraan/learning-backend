import { UserController } from "../controllers/user-controller"
import { ProfileController } from "../controllers/profile-controller"
import { CourseController } from "../controllers/course-controller"
import { ModuleController } from "../controllers/module-controller"
import { LessonController } from "../controllers/lesson-controller"
import { EnrollmentController } from "../controllers/enrollment-controller"
import { AssignmentController } from "../controllers/assignment-controller"
import { SubmissionController } from "../controllers/submission-controller"
import { ProgressController } from "../controllers/progress-controller"
import { NotificationController } from "../controllers/notification-controller"

import { ProfileService } from "../services/profile-service"
import { CourseService } from "../services/course-service"
import { authMiddleware } from "../middleware/auth-middleware"
import { authorizeRole } from "../middleware/auth-middleware"
import express, { RequestHandler } from "express"

export const privateApi = express.Router()
privateApi.use(authMiddleware as RequestHandler)

// User routes
privateApi.route("/api/users")
    .get(UserController.get)
    .patch(UserController.update)

privateApi.route("/api/user/:id?")
    .delete(authorizeRole(["ADMIN", ""]), UserController.delete)

privateApi.route("/api/allusers")
    .get(authorizeRole(["ADMIN", ""]), UserController.getAll)

privateApi.route("/api/logout")
    .delete(UserController.logout)

// Profile routes
privateApi.route("/api/profile/upload-picture")
    .post(authorizeRole(["STUDENT", "INSTRUCTOR", "ADMIN"]), ProfileService.uploadMiddleware, ProfileController.uploadPicture)
    
privateApi.route("/api/profile/:id?")
    .post(authorizeRole(["STUDENT", "INSTRUCTOR", "ADMIN"]), ProfileController.create)
    .get(authorizeRole(["STUDENT", "INSTRUCTOR", "ADMIN"]), ProfileController.get)
    .patch(authorizeRole(["STUDENT", "INSTRUCTOR", "ADMIN"]), ProfileController.update)
    .delete(authorizeRole(["STUDENT", "INSTRUCTOR", "ADMIN"]), ProfileController.delete)


// Course routes
privateApi.route("/api/course/upload-cover-image")
    .post( authorizeRole(["INSTRUCTOR", "ADMIN"]), CourseService.uploadMiddleware, CourseController.uploadPicture)

privateApi.route("/api/courses")
    .get(CourseController.getAll)

privateApi.route("/api/course/:id?")
    .post(authorizeRole(["INSTRUCTOR", "ADMIN"]), CourseController.create)
    .get(authorizeRole(["STUDENT", "INSTRUCTOR", "ADMIN"]), CourseController.get)
    .patch(authorizeRole(["INSTRUCTOR", "ADMIN"]), CourseController.update)
    .delete(authorizeRole(["INSTRUCTOR", "ADMIN"]), CourseController.delete)



// Module routes
privateApi.route("/api/course/:id/module")
    .post(authorizeRole(["INSTRUCTOR", "ADMIN"]), ModuleController.create)
    .get(ModuleController.getAll)

privateApi.route("/api/module/:id")
    .get(ModuleController.get)
    .patch(authorizeRole(["INSTRUCTOR", "ADMIN"]), ModuleController.update)
    .delete(authorizeRole(["INSTRUCTOR", "ADMIN"]), ModuleController.delete)

// Lesson routes
privateApi.route("/api/module/:id/lesson")
    .post(authorizeRole(["INSTRUCTOR", "ADMIN"]), LessonController.create)
    .get(LessonController.getAll)

privateApi.route("/api/lesson/:id")
    .get(LessonController.get)
    .patch(authorizeRole(["INSTRUCTOR", "ADMIN"]), LessonController.update)
    .delete(authorizeRole(["INSTRUCTOR", "ADMIN"]), LessonController.delete)

// Enrollment routes
privateApi.route("/api/course/:id/enroll")
    .post(authorizeRole(["STUDENT", "ADMIN"]), EnrollmentController.create)

privateApi.route("/api/enrollments/bycourse/:id")
    .get(authorizeRole(["STUDENT", "INSTRUCTOR", "ADMIN"]), EnrollmentController.getAllByCourse)

privateApi.route("/api/enrollments")
    .get(authorizeRole(["STUDENT", "INSTRUCTOR", "ADMIN"]), EnrollmentController.getAll)

privateApi.route("/api/enrollment/:id")
    .get(authorizeRole(["STUDENT", "INSTRUCTOR", "ADMIN"]), EnrollmentController.get)
    .patch(authorizeRole(["STUDENT", "INSTRUCTOR", "ADMIN"]), EnrollmentController.update)
    .delete(authorizeRole(["STUDENT", "INSTRUCTOR", "ADMIN"]), EnrollmentController.delete)

// Assignment routes
privateApi.route("/api/lesson/:id/assignment")
    .post(authorizeRole(["INSTRUCTOR", "ADMIN"]), AssignmentController.create)

privateApi.route("/api/assignments")
    .get(authorizeRole(["STUDENT", "INSTRUCTOR", "ADMIN"]), AssignmentController.getAll)

privateApi.route("/api/assignment/:id")
    .get(authorizeRole(["STUDENT", "INSTRUCTOR", "ADMIN"]), AssignmentController.get)
    .patch(authorizeRole(["INSTRUCTOR", "ADMIN"]), AssignmentController.update)
    .delete(authorizeRole(["INSTRUCTOR", "ADMIN"]), AssignmentController.delete)

privateApi.route("/api/assignments/bylesson/:id")
    .get(authorizeRole(["STUDENT", "INSTRUCTOR", "ADMIN"]), AssignmentController.getAllByLesson)

// Submission routes
privateApi.route("/api/assignment/:id/submission")
    .post(authorizeRole(["STUDENT", "ADMIN"]), SubmissionController.create)

privateApi.route("/api/submissions")
    .get(authorizeRole(["STUDENT", "INSTRUCTOR", "ADMIN"]), SubmissionController.getAll)

privateApi.route("/api/submission/:id")
    .get(authorizeRole(["STUDENT", "INSTRUCTOR", "ADMIN"]), SubmissionController.get)
    .patch(authorizeRole(["INSTRUCTOR", "ADMIN"]), SubmissionController.update)
    .delete(authorizeRole(["", "ADMIN"]), SubmissionController.delete)

privateApi.route("/api/submissions/byassignment/:id")
    .get(authorizeRole(["STUDENT", "INSTRUCTOR", "ADMIN"]), SubmissionController.getAllBySubmission)


// Progress routes
privateApi.route("/api/course/:id/progress")
    .post(authorizeRole(["STUDENT", "ADMIN"]), ProgressController.create)

privateApi.route("/api/progress")
    .get(authorizeRole(["STUDENT", "INSTRUCTOR", "ADMIN"]), ProgressController.getAll)
    
privateApi.route("/api/progress/:id")
    .get(authorizeRole(["STUDENT", "INSTRUCTOR", "ADMIN"]), ProgressController.get)
    .patch(authorizeRole(["STUDENT", "INSTRUCTOR", "ADMIN"]), ProgressController.update)
    .delete(authorizeRole(["STUDENT", "INSTRUCTOR", "ADMIN"]), ProgressController.delete)

privateApi.route("/api/courses/:id/progress")
    .get(authorizeRole(["STUDENT", "INSTRUCTOR", "ADMIN"]), ProgressController.getAllByCourse)


// Notification routes
privateApi.route("/api/notifications")
    .post(authorizeRole(["STUDENT", "INSTRUCTOR", "ADMIN"]), NotificationController.create)
    .get(authorizeRole(["STUDENT", "INSTRUCTOR", "ADMIN"]), NotificationController.getAll)
    .delete(authorizeRole(["STUDENT", "INSTRUCTOR", "ADMIN"]), NotificationController.deleteAll)

privateApi.route("/api/notifications/unread")
    .get(authorizeRole(["STUDENT", "INSTRUCTOR", "ADMIN"]), NotificationController.getUnread)

privateApi.route("/api/notifications/read-all")
    .post(authorizeRole(["STUDENT", "INSTRUCTOR", "ADMIN"]), NotificationController.markAllAsRead)

privateApi.route("/api/notifications/:id")
    .get(authorizeRole(["STUDENT", "INSTRUCTOR", "ADMIN"]), NotificationController.get)
    .patch(authorizeRole(["STUDENT", "INSTRUCTOR", "ADMIN"]), NotificationController.update)
    .delete(authorizeRole(["STUDENT", "INSTRUCTOR", "ADMIN"]), NotificationController.delete)

privateApi.route("/api/notifications/:id/read")
    .post(authorizeRole(["STUDENT", "INSTRUCTOR", "ADMIN"]), NotificationController.markAsRead)