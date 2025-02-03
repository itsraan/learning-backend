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
exports.NotificationController = void 0;
const notification_service_1 = require("../services/notification-service");
class NotificationController {
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = req.body;
                const response = yield notification_service_1.NotificationService.create(req.user, request);
                res.status(201).json({
                    data: response
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static get(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notificationId = req.params.id;
                const response = yield notification_service_1.NotificationService.get(req.user, notificationId);
                res.status(200).json({
                    data: response
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield notification_service_1.NotificationService.getAll(req.user);
                res.status(200).json({
                    data: response
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getUnread(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield notification_service_1.NotificationService.getUnread(req.user);
                res.status(200).json({
                    data: response
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static markAsRead(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notificationId = req.params.id;
                const response = yield notification_service_1.NotificationService.markAsRead(req.user, notificationId);
                res.status(200).json({
                    data: response
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static markAllAsRead(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield notification_service_1.NotificationService.markAllAsRead(req.user);
                res.status(200).json({
                    data: "OK"
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notificationId = req.params.id;
                const request = req.body;
                const response = yield notification_service_1.NotificationService.update(req.user, notificationId, request);
                res.status(200).json({
                    data: response
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notificationId = req.params.id;
                const response = yield notification_service_1.NotificationService.delete(req.user, notificationId);
                res.status(200).json({
                    data: "OK"
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deleteAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield notification_service_1.NotificationService.deleteAll(req.user);
                res.status(200).json({
                    data: "OK"
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.NotificationController = NotificationController;
