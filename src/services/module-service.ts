import { CreateModuleRequest, UpdateModuleRequest, ModuleResponse, toModuleResponse } from "../models/module-model"
import { Validation } from "../util/validation/validation"
import { ModuleValidation } from "../util/validation/module-validation"
import { prismaClient } from "../app/database"
import { ResponseError } from "../util/error/error"
import { Module, User } from "@prisma/client"

export class ModuleService {
    static async create(user: User, courseId: string, request: CreateModuleRequest): Promise<ModuleResponse> {
        const course = await prismaClient.course.findFirst({
            where: {
                id: courseId,
                authorId: user.id
            }
        })

        if(!course) {
            throw new ResponseError(400, "You are not authorized to create module for this course")
        }

        const createRequest = Validation.validate(ModuleValidation.CREATE, request)
        const existingModule = await prismaClient.module.findFirst({
            where: {
                courseId: course.id,
                OR: [
                    { title: createRequest.title },
                    { order: createRequest.order },
                ]
            }
        })
    
        if (existingModule) {
            if (existingModule.title === createRequest.title) {
                throw new ResponseError(400, "Module with this title already exists")
            } else {
                throw new ResponseError(400, "Module with this order already exists")
            }
        }

        const recordData = {
            ...createRequest,
            ...{courseId: course.id}
        }

        const createResponse = await prismaClient.module.create({
            data: recordData
        })

        return toModuleResponse(createResponse)
    }

    static async get(user: User, id: string): Promise<ModuleResponse> {
        const module = await prismaClient.module.findFirst({
            where: { id },
            include: {
                course: {
                    select: {
                        authorId: true
                    }
                }
            }
        })
    
        if (!module) {
            throw new ResponseError(404, "Module not found")
        }
    
        if (user.role === "INSTRUCTOR" && module.course?.authorId !== user.id) {
            throw new ResponseError(403, "You are not authorized to access this module")
        }
    
        return toModuleResponse(module)      
    }

    static async getAll(user: User, courseId: string): Promise<ModuleResponse[]> {
        const modules = await prismaClient.module.findMany({
            where: { courseId },
            include: {
                course: {
                    select: {
                        authorId: true
                    }
                }
            },
            orderBy: { order: 'asc' }
        })
    
        if (user.role === "INSTRUCTOR") {
            return modules
                .filter(module => module.course?.authorId === user.id)
                .map(toModuleResponse)
        }
    
        return modules.map(toModuleResponse)    
    }

    static async update(user: User, id: string, request: UpdateModuleRequest): Promise<ModuleResponse> {
        const module = await prismaClient.module.findFirst({
            where: { id },
            include: {
                course: {
                    select: {
                        authorId: true
                    }
                }
            }
        })
    
        if (!module) {
            throw new ResponseError(404, "Module not found")
        }
    
        if (user.role !== "ADMIN" && (user.role === "INSTRUCTOR" && module.course?.authorId !== user.id)) {
            throw new ResponseError(403, "You are not authorized to update this module")
        }
    
        const updateRequest = Validation.validate(ModuleValidation.UPDATE, request)
    
        if (updateRequest.order) {
            const existingOrder = await prismaClient.module.findFirst({
                where: {
                    courseId: module.courseId,
                    order: updateRequest.order,
                    id: { not: id }
                }
            })
    
            if (existingOrder) {
                throw new ResponseError(400, "Module order already exists in this course")
            }
        }
    
        const updateResponse = await prismaClient.module.update({
            where: { id },
            data: updateRequest
        })
    
        return toModuleResponse(updateResponse)    
    }

    static async delete(user: User, id: string): Promise<ModuleResponse> { 
        const module = await prismaClient.module.findFirst({
            where: { id },
            include: {
                course: {
                    select: {
                        authorId: true
                    }
                }
            }
        })
    
        if (!module) {
            throw new ResponseError(404, "Module not found")
        }
    
        if (user.role !== "ADMIN" && (user.role === "INSTRUCTOR" && module.course?.authorId !== user.id)) {
            throw new ResponseError(403, "You are not authorized to delete this module")
        }
    
        const deleteResponse = await prismaClient.module.delete({
            where: { id }
        })
    
        return toModuleResponse(deleteResponse)
    }
}