"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toEnrollmentResponse = toEnrollmentResponse;
function toEnrollmentResponse(enrollment) {
    return {
        id: enrollment.id,
        userId: enrollment.userId,
        courseId: enrollment.courseId,
        enrolledAt: enrollment.enrolledAt,
        completedAt: enrollment.completedAt
    };
}
