import { Notification } from "@prisma/client"
import { NotificationType } from "@prisma/client"

export type NotificationResponse = {
    id: string
    message: string
    type: NotificationType
    isRead: boolean
    createdAt: Date
}

export type CreateNotificationRequest = {
    message: string
    type: NotificationType
    isRead: boolean
}

export type UpdateNotficationRequest = {
    message?: string
    type?: NotificationType
    isRead?: boolean
}

export function toNotificationResponse(notification: Notification): NotificationResponse {
    return {
        id: notification.id,
        message: notification.message,
        type: notification.type,
        isRead: notification.isRead,
        createdAt: notification.createdAt
    }
}