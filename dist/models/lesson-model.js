"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toLessonResponse = toLessonResponse;
function toLessonResponse(lesson) {
    return {
        id: lesson.id,
        title: lesson.title,
        content: lesson.content,
        videoUrl: lesson.videoUrl,
        resourceUrls: lesson.resourceUrls,
        order: lesson.order
    };
}
