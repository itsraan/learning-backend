"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toAssignmentResponse = toAssignmentResponse;
function toAssignmentResponse(assignment) {
    return {
        id: assignment.id,
        lessonId: assignment.lessonId,
        authorId: assignment.authorId,
        title: assignment.title,
        description: assignment.description,
        maxScore: assignment.maxScore,
        dueDate: assignment.dueDate
    };
}
