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
        fileSize: 5 * 1024 * 1024 // Batasan 5MB
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

    static async get(user: User, id: string): Promise<ProfileResponse> {
        const profile = await this.checkProfileMustBeExists(user.id, id)
        return toProfileResponse(profile)
    }

    static async update(user: User, request: UpdateProfileRequest): Promise<ProfileResponse> {
        const updateRequest = Validation.validate(ProfileValidation.UPDATE, request)
        await this.checkProfileMustBeExists(user.id, updateRequest.id)

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
        await this.checkProfileMustBeExists(user.id, id)

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