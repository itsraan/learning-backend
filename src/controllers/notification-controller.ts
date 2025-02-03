import { CreateNotificationRequest, UpdateNotficationRequest } from "../models/notification-model"
import { NotificationService } from "../services/notification-service"
import { UserRequest } from "../util/type/type"
import { Response, NextFunction } from "express"

export class NotificationController {
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: CreateNotificationRequest = req.body as CreateNotificationRequest
            const response = await NotificationService.create(req.user!, request)
            res.status(201).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const notificationId = req.params.id
            const response = await NotificationService.get(req.user!, notificationId)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async getAll(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await NotificationService.getAll(req.user!)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async getUnread(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await NotificationService.getUnread(req.user!)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async markAsRead(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const notificationId = req.params.id
            const response = await NotificationService.markAsRead(req.user!, notificationId)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async markAllAsRead(req: UserRequest, res: Response, next: NextFunction) {
        try {
            await NotificationService.markAllAsRead(req.user!)
            res.status(200).json({
                data: "OK"
            })
        } catch (error) {
            next(error)
        }
    }

    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const notificationId = req.params.id
            const request: UpdateNotficationRequest = req.body as UpdateNotficationRequest
            const response = await NotificationService.update(req.user!, notificationId, request)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async delete(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const notificationId = req.params.id
            const response = await NotificationService.delete(req.user!, notificationId)
            res.status(200).json({
                data: "OK"
            })
        } catch (error) {
            next(error)
        }
    }

    static async deleteAll(req: UserRequest, res: Response, next: NextFunction) {
        try {
            await NotificationService.deleteAll(req.user!)
            res.status(200).json({
                data: "OK"
            })
        } catch (error) {
            next(error)
        }
    }
}