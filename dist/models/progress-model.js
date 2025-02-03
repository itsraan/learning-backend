"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toProgressResponse = toProgressResponse;
function toProgressResponse(progress) {
    return {
        id: progress.id,
        userId: progress.userId,
        courseId: progress.courseId,
        progress: progress.progress,
        completedLessons: progress.completedLessons,
        lastAccessedAt: progress.lastAccessedAt
    };
}
