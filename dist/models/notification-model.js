"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNotificationResponse = toNotificationResponse;
function toNotificationResponse(notification) {
    return {
        id: notification.id,
        message: notification.message,
        type: notification.type,
        isRead: notification.isRead,
        createdAt: notification.createdAt
    };
}
