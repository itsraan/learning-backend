import { CreateProfileRequest, UpdateProfileRequest, ProfileResponse, toProfileResponse } from "../models/profile-model"
import { Validation } from "../util/validation/validation"
import { ProfileValidation } from "../util/validation/profile-validation"
import { prismaClient } from "../app/database"
import { ResponseError } from "../util/error/error"
import { Profile, User } from "@prisma/client"

import multer from "multer"
import path from "path"
import fs from "fs"
import { Request } from "express"

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

export class ProfileService {
    static async create(user: User, request: CreateProfileRequest): Promise<ProfileResponse> {
        const createRequest = Validation.validate(ProfileValidation.CREATE, request)
        const existingProfile = await prismaClient.profile.findUnique({
            where: {
                userId: user.id
            }
        })

        if(existingProfile) {
            throw new ResponseError(400, "Profile already exists")
        }

        const recordData = {
            ...createRequest,
            ...{userId: user.id}
        }

        const createResponse = await prismaClient.profile.create({
            data: recordData
        })

        return toProfileResponse(createResponse)
    }

    static async checkProfileMustBeExists(userId: string, profileId: string): Promise<Profile> {
        const profile = await prismaClient.profile.findFirst({
            where: {
                id: profileId,
                userId: userId
            }
        })

        if(!profile) {
            throw new ResponseError(404, "Profile not found")
        }

        return profile
    }

    static async get(user: User, profileId: string): Promise<ProfileResponse> {
        const profile = await prismaClient.profile.findUnique({
            where: { id: profileId },
            include: { user: true }
        })
    
        if (!profile) {
            throw new ResponseError(404, "Profile not found")
        }
    
        if (user.role === 'STUDENT' && profile.userId !== user.id) {
            throw new ResponseError(403, "STUDENT tidak dapat mengakses profil pengguna lain")
        }
    
        if (user.role === 'INSTRUCTOR') {
            if (profile.userId === user.id) {
                return toProfileResponse(profile)
            }
            
            const isStudentUnderInstructor = await prismaClient.enrollment.findFirst({
                where: {
                    userId: profile.userId,
                    course: {
                        authorId: user.id
                    }
                }
            })
    
            if (!isStudentUnderInstructor) {
                throw new ResponseError(403, "Anda tidak memiliki akses ke profil ini")
            }
        }
    
        if (user.role === 'ADMIN') {
            return toProfileResponse(profile)
        }
    
        return toProfileResponse(profile)
    }    

    static async getAll(user: User): Promise<ProfileResponse[]> {
        if (user.role === 'ADMIN') {
            const profiles = await prismaClient.profile.findMany({
                include: { user: true }
            })
            return profiles.map(toProfileResponse)
        }
    
        if (user.role === 'INSTRUCTOR') {
            const coursesTaught = await prismaClient.course.findMany({
                where: { authorId: user.id },
                select: { id: true }
            })
    
            const courseIds = coursesTaught.map(course => course.id)
    
            const studentEnrollments = await prismaClient.enrollment.findMany({
                where: { courseId: { in: courseIds } },
                include: { user: { include: { profile: true } } }
            })
    
            const studentProfiles = studentEnrollments
                .map(enrollment => enrollment.user.profile)
                .filter(profile => profile !== null)
    
            return studentProfiles.map(toProfileResponse)
        }
    
        throw new ResponseError(403, "Akses ditolak")
    }        

    static async update(user: User, request: UpdateProfileRequest): Promise<ProfileResponse> {
        const updateRequest = Validation.validate(ProfileValidation.UPDATE, request)
        const profile = await prismaClient.profile.findUnique({
            where: { id: updateRequest.id }
        })
    
        if (!profile) {
            throw new ResponseError(404, "Profile not found")
        }
    
        if (user.role === 'STUDENT' && profile.userId !== user.id) {
            throw new ResponseError(403, "STUDENT tidak dapat memperbarui profil pengguna lain")
        }
    
        if (user.role === 'INSTRUCTOR') {
            if (profile.userId !== user.id) {
                const isStudentUnderInstructor = await prismaClient.enrollment.findFirst({
                    where: {
                        userId: profile.userId,
                        course: {
                            authorId: user.id
                        }
                    }
                })
    
                if (!isStudentUnderInstructor) {
                    throw new ResponseError(403, "INSTRUCTOR tidak dapat memperbarui profil ini")
                }
            }
        }
    
        const updateData = Object.keys(updateRequest).reduce((data, key) => {
            if (updateRequest[key] !== undefined) {
                data[key] = updateRequest[key]
            }
            return data
        }, {} as any)
    
        const updateResponse = await prismaClient.profile.update({
            where: { id: updateRequest.id },
            data: updateData,
        })
    
        return toProfileResponse(updateResponse)
    }    

    static async delete(user: User, id: string): Promise<ProfileResponse> {
        if (user.role === 'STUDENT' && user.id !== id) {
            throw new ResponseError(403, "STUDENT tidak dapat menghapus profil pengguna lain");
        }
    
        if (user.role === 'INSTRUCTOR' && user.id === id) {
            throw new ResponseError(403, "INSTRUCTOR tidak dapat menghapus profil mereka sendiri");
        }
    
        if (user.role === 'ADMIN') {
            const profile = await prismaClient.profile.findFirst({
                where: { id }
            });
    
            if (!profile) {
                throw new ResponseError(404, "Profile not found");
            }
        }

        const profile = await prismaClient.profile.findUnique({
            where: {
                id: id,
                userId: user.id
            }
        })
    
        if (profile?.profilePicture) {
            const filePath = path.join(__dirname, '../../public/images', profile.profilePicture)
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath)
            }
        }

        const deleteResponse = await prismaClient.profile.delete({
            where: {
                id: id,
                userId: user.id
            }
        })

        return toProfileResponse(deleteResponse)
    }

    static async uploadProfilePicture(user: User, file: Express.Multer.File): Promise<ProfileResponse> {
        if (!file) {
            throw new ResponseError(400, 'No file uploaded')
        }
    
        const profile = await prismaClient.profile.findUnique({
            where: { userId: user.id }
        })
    
        if (!profile) {
            throw new ResponseError(404, 'Profile not found')
        }
    
        if (user.role === 'STUDENT' && profile.userId !== user.id) {
            throw new ResponseError(403, 'STUDENT tidak dapat mengunggah gambar untuk profil pengguna lain')
        }
    
        if (user.role === 'INSTRUCTOR') {
            if (profile.userId !== user.id) {
                const isStudentUnderInstructor = await prismaClient.enrollment.findFirst({
                    where: {
                        userId: profile.userId,
                        course: {
                            authorId: user.id
                        }
                    }
                })
    
                if (!isStudentUnderInstructor) {
                    throw new ResponseError(403, 'INSTRUCTOR tidak dapat mengunggah gambar untuk profil ini')
                }
            }
        }
    
        if (profile.profilePicture) {
            const oldFilePath = path.join(__dirname, '../../public/images', profile.profilePicture)
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath)
            }
        }
    
        const updatedProfile = await prismaClient.profile.update({
            where: { userId: user.id },
            data: { 
                profilePicture: file.filename 
            }
        })
    
        return toProfileResponse(updatedProfile)
    }
    

    static uploadMiddleware = upload.single('profilePicture')
}