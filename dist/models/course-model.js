"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCourseResponse = toCourseResponse;
function toCourseResponse(course) {
    return {
        id: course.id,
        title: course.title,
        description: course.description,
        authorId: course.authorId,
        category: course.category,
        level: course.level,
        price: course.price,
        coverImage: course.coverImage,
        createdAt: course.createdAt
    };
}
