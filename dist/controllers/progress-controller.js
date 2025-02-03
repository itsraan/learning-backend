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
exports.ProgressController = void 0;
const progress_service_1 = require("../services/progress-service");
class ProgressController {
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = req.params.id;
                const request = req.body;
                const response = yield progress_service_1.ProgressService.create(req.user, courseId, request);
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
                const progressId = req.params.id;
                const response = yield progress_service_1.ProgressService.get(req.user, progressId);
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
                const response = yield progress_service_1.ProgressService.getAll(req.user);
                res.status(200).json({
                    data: response
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getAllByCourse(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = req.params.id;
                const response = yield progress_service_1.ProgressService.getAllByCourse(courseId);
                res.status(200).json({
                    data: response
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
                const { id } = req.params;
                const request = req.body;
                const response = yield progress_service_1.ProgressService.update(req.user, id, request);
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
                const progressId = req.params.id;
                yield progress_service_1.ProgressService.delete(req.user, progressId);
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
exports.ProgressController = ProgressController;
