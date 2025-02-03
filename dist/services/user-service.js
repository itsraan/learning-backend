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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_model_1 = require("../models/user-model");
const validation_1 = require("../util/validation/validation");
const user_validation_1 = require("../util/validation/user-validation");
const database_1 = require("../app/database");
const error_1 = require("../util/error/error");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserService {
    static register(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const registerRequest = validation_1.Validation.validate(user_validation_1.UserValidation.REGISTER, request);
            const existingUser = yield database_1.prismaClient.user.findFirst({
                where: {
                    OR: [
                        { email: registerRequest.email },
                        { username: registerRequest.username }
                    ]
                }
            });
            if (existingUser) {
                if (existingUser.email === registerRequest.email) {
                    throw new error_1.ResponseError(400, "Email already exists");
                }
                if (existingUser.username === registerRequest.username) {
                    throw new error_1.ResponseError(400, "Username already exists");
                }
            }
            const hashedPassword = yield bcrypt_1.default.hash(registerRequest.password, 10);
            const userResponse = yield database_1.prismaClient.user.create({
                data: {
                    username: registerRequest.username,
                    email: registerRequest.email,
                    password: hashedPassword,
                    role: registerRequest.role || "STUDENT"
                }
            });
            return (0, user_model_1.toUserResponse)(userResponse);
        });
    }
    static get(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, user_model_1.toUserResponse)(user);
        });
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield database_1.prismaClient.user.findMany();
            return users.map(user_model_1.toUserResponse);
        });
    }
    static update(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateRequest = validation_1.Validation.validate(user_validation_1.UserValidation.UPDATE, request);
            const updateData = {};
            if (updateRequest.username) {
                updateData.username = updateRequest.username;
            }
            if (updateRequest.password) {
                updateData.password = yield bcrypt_1.default.hash(updateRequest.password, 10);
            }
            const updateResponse = yield database_1.prismaClient.user.update({
                where: {
                    id: user.id
                },
                data: updateData
            });
            return (0, user_model_1.toUserResponse)(updateResponse);
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteResponse = yield database_1.prismaClient.user.delete({
                where: {
                    id
                }
            });
            return (0, user_model_1.toUserResponse)(deleteResponse);
        });
    }
    static login(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginRequest = validation_1.Validation.validate(user_validation_1.UserValidation.LOGIN, request);
            let user = yield database_1.prismaClient.user.findUnique({
                where: {
                    email: loginRequest.email
                }
            });
            if (!user) {
                throw new error_1.ResponseError(400, "Email or Password invalid");
            }
            const comparePassword = yield bcrypt_1.default.compare(loginRequest.password, user.password);
            if (!comparePassword) {
                throw new error_1.ResponseError(400, "Email or Password invalid");
            }
            const token = jsonwebtoken_1.default.sign({
                id: user.id,
                username: user.username,
                email: user.email,
            }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.EXPIRED });
            user = yield database_1.prismaClient.user.update({
                where: {
                    id: user.id
                },
                data: {
                    token
                }
            });
            return (0, user_model_1.toUserResponse)(user);
        });
    }
    static logout(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const logoutResponse = yield database_1.prismaClient.user.update({
                where: { id: user.id }, data: { token: null }
            });
            return (0, user_model_1.toUserResponse)(logoutResponse);
        });
    }
}
exports.UserService = UserService;
