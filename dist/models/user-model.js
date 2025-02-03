"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUserResponse = toUserResponse;
function toUserResponse(user) {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: user.token
    };
}
