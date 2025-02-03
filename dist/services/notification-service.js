"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const notification_model_1 = require("../models/notification-model");
const validation_1 = require("../util/validation/validation");
const notification_validation_1 = require("../util/validation/notification-validation");
const database_1 = require("../app/database");
const error_1 = require("../util/error/error");
class NotificationService {
    static create(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(notification_validation_1.NotificationValidation.CREATE, request);
            const createResponse = yield database_1.prismaClient.notification.create({
                data: Object.assign(Object.assign({}, createRequest), { userId: user.id, isRead: false }),
                include: {
                    user: true
                }
            });
            return (0, notification_model_1.toNotificationResponse)(createResponse);
        });
    }
    static get(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield database_1.prismaClient.notification.findFirst({
                where: {
                    id,
                    userId: user.id
                },
                include: {
                    user: true
                }
            });
            if (!notification) {
                throw new error_1.ResponseError(404, "Notifikasi tidak ditemukan");
            }
            return (0, notification_model_1.toNotificationResponse)(notification);
        });
    }
    static getAll(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const notifications = yield database_1.prismaClient.notification.findMany({
                where: {
                    userId: user.id
                },
                include: {
                    user: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return notifications.map(notification_model_1.toNotificationResponse);
        });
    }
    static getUnread(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const notifications = yield database_1.prismaClient.notification.findMany({
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
            });
            return notifications.map(notification_model_1.toNotificationResponse);
        });
    }
    static markAsRead(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield database_1.prismaClient.notification.findFirst({
                where: {
                    id,
                    userId: user.id
                }
            });
            if (!notification) {
                throw new error_1.ResponseError(404, "Notifikasi tidak ditemukan");
            }
            const updateResponse = yield database_1.prismaClient.notification.update({
                where: { id },
                data: {
                    isRead: true
                },
                include: {
                    user: true
                }
            });
            return (0, notification_model_1.toNotificationResponse)(updateResponse);
        });
    }
    static markAllAsRead(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.prismaClient.notification.updateMany({
                where: {
                    userId: user.id,
                    isRead: false
                },
                data: {
                    isRead: true
                }
            });
        });
    }
    static update(user, id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield database_1.prismaClient.notification.findFirst({
                where: {
                    id,
                    userId: user.id
                },
                include: {
                    user: true
                }
            });
            if (!notification) {
                throw new error_1.ResponseError(404, "Notifikasi tidak ditemukan");
            }
            const updateRequest = validation_1.Validation.validate(notification_validation_1.NotificationValidation.UPDATE, request);
            const updateResponse = yield database_1.prismaClient.notification.update({
                where: { id },
                data: updateRequest,
                include: {
                    user: true
                }
            });
            return (0, notification_model_1.toNotificationResponse)(updateResponse);
        });
    }
    static delete(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield database_1.prismaClient.notification.findFirst({
                where: {
                    id,
                    userId: user.id
                },
                include: {
                    user: true
                }
            });
            if (!notification) {
                throw new error_1.ResponseError(404, "Notifikasi tidak ditemukan");
            }
            const deleteResponse = yield database_1.prismaClient.notification.delete({
                where: { id },
                include: {
                    user: true
                }
            });
            return (0, notification_model_1.toNotificationResponse)(deleteResponse);
        });
    }
    static deleteAll(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.prismaClient.notification.deleteMany({
                where: {
                    userId: user.id
                }
            });
        });
    }
}
exports.NotificationService = NotificationService;
