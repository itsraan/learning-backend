import { CreateNotificationRequest, UpdateNotficationRequest, NotificationResponse, toNotificationResponse } from "../models/notification-model"
import { Validation } from "../util/validation/validation"
import { NotificationValidation } from "../util/validation/notification-validation"
import { prismaClient } from "../app/database"
import { ResponseError } from "../util/error/error"
import { User } from "@prisma/client"

export class NotificationService {
    static async create(user: User, request: CreateNotificationRequest): Promise<NotificationResponse> {
        if (user.role === 'STUDENT') {
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

        if (user.role === 'INSTRUCTOR' || user.role === 'ADMIN') {
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

        throw new ResponseError(403, "Role tidak valid untuk membuat notifikasi")
    }

    static async get(user: User, id: string): Promise<NotificationResponse> {
        if (user.role === 'STUDENT') {
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

        if (user.role === 'INSTRUCTOR' || user.role === 'ADMIN') {
            const notification = await prismaClient.notification.findFirst({
                where: {
                    id
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

        throw new ResponseError(403, "Anda tidak memiliki akses untuk melihat notifikasi ini")
    }

    static async getAll(user: User): Promise<NotificationResponse[]> {
        if (user.role === 'STUDENT') {
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

        if (user.role === 'INSTRUCTOR') {
            const notifications = await prismaClient.notification.findMany({
                where: {
                    user: {
                        enrollments: {
                            some: {
                                course: {
                                    authorId: user.id
                                }
                            }
                        }
                    }
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

        const notifications = await prismaClient.notification.findMany({
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
        if (user.role === 'STUDENT') {
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

        const notifications = await prismaClient.notification.findMany({
            where: {
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
        if (user.role === 'STUDENT') {
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

        const notification = await prismaClient.notification.findFirst({
            where: {
                id
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
        if (user.role === 'STUDENT') {
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

        if (user.role === 'INSTRUCTOR' || user.role === 'ADMIN') {
            await prismaClient.notification.updateMany({
                where: {
                    isRead: false
                },
                data: {
                    isRead: true
                }
            })
        }
    }

    static async update(user: User, id: string, request: UpdateNotficationRequest): Promise<NotificationResponse> {
        if (user.role === 'STUDENT') {
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

        const notification = await prismaClient.notification.findFirst({
            where: {
                id
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
        if (user.role === 'STUDENT') {
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

        const notification = await prismaClient.notification.findFirst({
            where: {
                id
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
        if (user.role === 'STUDENT') {
            await prismaClient.notification.deleteMany({
                where: {
                    userId: user.id
                }
            })
        }

        if (user.role === 'INSTRUCTOR' || user.role === 'ADMIN') {
            await prismaClient.notification.deleteMany({
                where: {
                    userId: user.id
                }
            })
        }
    }
}
