"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const error_middleware_1 = require("../middleware/error-middleware");
const public_api_1 = require("../routes/public-api");
const private_api_1 = require("../routes/private-api");
dotenv_1.default.config();
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)({
    origin: process.env.CLIENT_PORT,
    credentials: true
}));
exports.app.use(public_api_1.publicApi);
exports.app.use(private_api_1.privateApi);
exports.app.use(error_middleware_1.errorMiddleware);
