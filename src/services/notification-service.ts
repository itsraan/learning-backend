import { CreateNotificationRequest, UpdateNotficationRequest, NotificationResponse, toNotificationResponse } from "../models/notification-model"
import { Validation } from "../util/validation/validation"
import { NotificationValidation } from "../util/validation/notification-validation"
import { prismaClient } from "../app/database"
import { ResponseError } from "../util/error/error"
import { User } from "@prisma/client"

export class NotificationService {
    static async create(user: User, request: CreateNotificationRequest): Promise<NotificationResponse> {
        const createRequest = Validation.validate(NotificationValidation.CREATE, request)
        const createResponse = await prismaClient.notification.create({
            data: {
                ...createRequest,
                userId: user.id,
                isRead: false
            },
            include: {
                user: true
            }
        })

        return toNotificationResponse(createResponse)
    }

    static async get(user: User, id: string): Promise<NotificationResponse> {
        const notification = await prismaClient.notification.findFirst({
            where: {
                id,
                userId: user.id
            },
            include: {
                user: true
            }
        })

        if (!notification) {
            throw new ResponseError(404, "Notifikasi tidak ditemukan")
        }

        return toNotificationResponse(notification)
    }

    static async getAll(user: User): Promise<NotificationResponse[]> {
        const notifications = await prismaClient.notification.findMany({
            where: {
                userId: user.id
            },
            include: {
                user: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return notifications.map(toNotificationResponse)
    }

    static async getUnread(user: User): Promise<NotificationResponse[]> {
        const notifications = await prismaClient.notification.findMany({
            where: {
                userId: user.id,
                isRead: false
            },
            include: {
                user: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return notifications.map(toNotificationResponse)
    }

    static async markAsRead(user: User, id: string): Promise<NotificationResponse> {
        const notification = await prismaClient.notification.findFirst({
            where: {
                id,
                userId: user.id
            }
        })

        if (!notification) {
            throw new ResponseError(404, "Notifikasi tidak ditemukan")
        }

        const updateResponse = await prismaClient.notification.update({
            where: { id },
            data: {
                isRead: true
            },
            include: {
                user: true
            }
        })

        return toNotificationResponse(updateResponse)
    }

    static async markAllAsRead(user: User): Promise<void> {
        await prismaClient.notification.updateMany({
            where: {
                userId: user.id,
                isRead: false
            },
            data: {
                isRead: true
            }
        })
    }

    static async update(user: User, id: string, request: UpdateNotficationRequest): Promise<NotificationResponse> {
        const notification = await prismaClient.notification.findFirst({
            where: {
                id,
                userId: user.id
            },
            include: {
                user: true
            }
        })

        if (!notification) {
            throw new ResponseError(404, "Notifikasi tidak ditemukan")
        }

        const updateRequest = Validation.validate(NotificationValidation.UPDATE, request)
        const updateResponse = await prismaClient.notification.update({
            where: { id },
            data: updateRequest,
            include: {
                user: true
            }
        })

        return toNotificationResponse(updateResponse)
    }

    static async delete(user: User, id: string): Promise<NotificationResponse> {
        const notification = await prismaClient.notification.findFirst({
            where: {
                id,
                userId: user.id
            },
            include: {
                user: true
            }
        })

        if (!notification) {
            throw new ResponseError(404, "Notifikasi tidak ditemukan")
        }

        const deleteResponse = await prismaClient.notification.delete({
            where: { id },
            include: {
                user: true
            }
        })

        return toNotificationResponse(deleteResponse)
    }

    static async deleteAll(user: User): Promise<void> {
        await prismaClient.notification.deleteMany({
            where: {
                userId: user.id
            }
        })
    }
}