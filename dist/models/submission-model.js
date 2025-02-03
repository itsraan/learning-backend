"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSubmissionResponse = toSubmissionResponse;
function toSubmissionResponse(submission) {
    return {
        id: submission.id,
        userId: submission.userId,
        assignmentId: submission.assignmentId,
        content: submission.content,
        grade: submission.grade,
        submittedAt: submission.submittedAt
    };
}
