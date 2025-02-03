import { Module } from "@prisma/client"

export type ModuleResponse = {
    id: string
    title: string
    description: string | null
    order: number
}

export type CreateModuleRequest = {
    title: string
    description: string
    order: number
}

export type UpdateModuleRequest = {
    title?: string
    description?: string
    order?: number
}

export function toModuleResponse(module: Module): ModuleResponse {
    return {
        id: module.id,
        title: module.title,
        description: module.description,
        order: module.order
    }
}