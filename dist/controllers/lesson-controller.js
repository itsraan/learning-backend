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
exports.LessonController = void 0;
const lesson_service_1 = require("../services/lesson-service");
class LessonController {
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const moduleId = req.params.id;
                const request = req.body;
                const response = yield lesson_service_1.LessonService.create(req.user, moduleId, request);
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
                const lessonId = req.params.id;
                const response = yield lesson_service_1.LessonService.get(req.user, lessonId);
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
                const moduleId = req.params.id;
                const response = yield lesson_service_1.LessonService.getAll(req.user, moduleId);
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
                const response = yield lesson_service_1.LessonService.update(req.user, id, request);
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
                const lessonId = req.params.id;
                yield lesson_service_1.LessonService.delete(req.user, lessonId);
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
exports.LessonController = LessonController;
