import { CreateCourseRequest, UpdateCourseRequest, CourseResponse, toCourseResponse } from "../models/course-model"
import { Validation } from "../util/validation/validation"
import { CourseValidation } from "../util/validation/course-validation"
import { prismaClient } from "../app/database"
import { ResponseError } from "../util/error/error"
import { Course, User } from "@prisma/client"

import multer from "multer"
import path from "path"
import fs from "fs"
import { Request } from "express"
import { title } from "process"

const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        const uploadPath = path.join(__dirname, "../../public/images")

        if(!fs.existsSync(uploadPath)) {  
            fs.mkdirSync(uploadPath, { recursive: true })
        }
        cb(null, uploadPath)
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        const uniqueName = `${Date.now()}${path.extname(file.originalname)}`
        cb(null, uniqueName)
    }
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new ResponseError(400, 'Invalid file type. Only JPEG, PNG, and GIF are allowed.') as any, false)
    }
}

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { 
        fileSize: 1 * 1024 * 1024 
    }
})


export class CourseService {
    static async create(user: User, request: CreateCourseRequest): Promise<CourseResponse> {
        const createRequest = Validation.validate(CourseValidation.CREATE, request)
        const existingCourse = await prismaClient.course.findFirst({
            where: {
                authorId: user.id,
                title: createRequest.title
            }
        })

        if(existingCourse) {
            throw new ResponseError(400, "Course already exists")
        }

        const recordData = {
            ...createRequest,
            ...{authorId: user.id}
        }

        const createResponse = await prismaClient.course.create({
            data: recordData
        })

        return toCourseResponse(createResponse)
    }

    static async checkCourseMustBeExists(userId: string, courseId: string, userRole: string): Promise<Course> {
        const query: any = {
            where: {
                id: courseId
            }
        }

        if (userRole === "INSTRUCTOR") {
            query.where.authorId = userId
        }

        const course = await prismaClient.course.findFirst(query)
        if (!course) {
            throw new ResponseError(404, "Course not found")
        }

        if (userRole === "INSTRUCTOR" && course.authorId !== userId) {
            throw new ResponseError(403, "You don't have permission to access this course")
        }

        return course
    }

    static async get(user: User, id: string): Promise<CourseResponse> {
        const course = await this.checkCourseMustBeExists(user.id, id, user.role)
        return toCourseResponse(course)
    }

    static async getAll(user: User): Promise<CourseResponse[]> {
        const query: any = {
            include: { 
                author: true 
            },
            orderBy: {
                level: "asc"
            }
        }

        if (user.role === "INSTRUCTOR") {
            query.where = { authorId: user.id }
        } else if (user.role !== "ADMIN" && user.role !== "STUDENT") {
            throw new ResponseError(403, "Unauthorized role")
        }

        const courses = await prismaClient.course.findMany(query)
        return courses.map(toCourseResponse)
    }

    static async update(user: User, id: string, request: UpdateCourseRequest): Promise<CourseResponse> {
        const updateRequest = Validation.validate(CourseValidation.UPDATE, request)
        await this.checkCourseMustBeExists(user.id, updateRequest.id, user.role)
    
        if (user.role === "INSTRUCTOR") {
            const course = await prismaClient.course.findFirst({
                where: {
                    id: updateRequest.id,
                    authorId: user.id 
                }
            })
    
            if (!course) {
                throw new ResponseError(403, "You don't have permission to update this course")
            }
        }
    
        if (user.role === "ADMIN" || user.role === "INSTRUCTOR") {
            const updateData = Object.keys(updateRequest).reduce((data, key) => {
                if (updateRequest[key] !== undefined) {
                    data[key] = updateRequest[key]
                }
                return data
            }, {} as any)
    
            const updateResponse = await prismaClient.course.update({
                where: { id },
                data: updateData
            })
    
            return toCourseResponse(updateResponse)
        }
    
        throw new ResponseError(403, "You don't have permission to update this course")
    }    

    static async delete(user: User, id: string): Promise<CourseResponse> {
        const course = await this.checkCourseMustBeExists(user.id, id, user.role)
        if (user.role !== "ADMIN" && (user.role !== "INSTRUCTOR" || course.authorId !== user.id)) {
            throw new ResponseError(403, "You don't have permission to delete this course")
        }

        if (course?.coverImage) {
            const filePath = path.join(__dirname, '../../public/images', course.coverImage)
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath)
            }
        }

        const deleteResponse = await prismaClient.course.delete({
            where: { id }
        })

        return toCourseResponse(deleteResponse)
    }

    static async coverImage(user: User, file: Express.Multer.File): Promise<CourseResponse> {
        if (!file) {
            throw new ResponseError(400, 'No file uploaded')
        }

        const course = await prismaClient.course.findFirst({
            where: { authorId: user.id },
        })

        if (!course) {
            throw new ResponseError(404, 'Course not found')
        }

        if (course.coverImage) {
            const oldFilePath = path.join(__dirname, '../../public/images', course.coverImage)
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath) 
            }
        }

        const updatedCourse = await prismaClient.course.update({
            where: { id: course.id }, 
            data: { coverImage: file.filename },
        })

        return toCourseResponse(updatedCourse)
    }

    static uploadMiddleware = upload.single('coverImage')
}