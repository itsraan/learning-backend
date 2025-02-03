"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicApi = void 0;
const user_controller_1 = require("../controllers/user-controller");
const express_1 = __importDefault(require("express"));
exports.publicApi = express_1.default.Router();
exports.publicApi.post("/api/register", user_controller_1.UserController.register);
exports.publicApi.post("/api/login", user_controller_1.UserController.login);
