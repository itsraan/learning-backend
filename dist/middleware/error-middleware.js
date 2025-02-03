"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const zod_1 = require("zod");
const error_1 = require("../util/error/error");
const errorMiddleware = (err, req, res, next) => {
    if (err instanceof zod_1.ZodError) {
        res.status(400).json({
            errors: `Validation error ${JSON.stringify(err)}`
        });
    }
    else if (err instanceof error_1.ResponseError) {
        res.status(err.status).json({
            errors: err.message
        });
    }
    else {
        res.status(500).json({
            errors: err.message
        });
    }
};
exports.errorMiddleware = errorMiddleware;
