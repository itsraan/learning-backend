"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toModuleResponse = toModuleResponse;
function toModuleResponse(module) {
    return {
        id: module.id,
        title: module.title,
        description: module.description,
        order: module.order
    };
}
