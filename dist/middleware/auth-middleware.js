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
exports.authorizeRole = exports.authMiddleware = void 0;
const database_1 = require("../app/database");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(400).json({
                errors: "Unauthorized: No authorization header found"
            });
        }
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(400).json({
                errors: "Unauthorized: Invalid authorization header format"
            });
        }
        const token = authHeader.split(" ")[1];
        try {
            const secretKey = process.env.JWT_SECRET_KEY;
            const decodeed = jsonwebtoken_1.default.verify(token, secretKey);
            const user = yield database_1.prismaClient.user.findUnique({
                where: {
                    id: decodeed.id
                }
            });
            if (!user) {
                return res.status(400).json({
                    errors: "Unauthorized: User not found"
                });
            }
            req.user = user;
            next();
        }
        catch (jwtError) {
            return res.status(400).json({
                errors: "Unauthorized: Invalid token"
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            errors: "Internal server error"
        });
    }
});
exports.authMiddleware = authMiddleware;
const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user || !requiredRole.includes(req.user.role)) {
            return res.status(400).json({
                errors: "Forbidden: You don't have permission to access this resource"
            });
        }
        next();
    };
};
exports.authorizeRole = authorizeRole;
