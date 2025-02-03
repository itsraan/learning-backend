import { CreateProfileRequest, UpdateProfileRequest } from "../models/profile-model"
import { ProfileService } from "../services/profile-service"
import { UserRequest } from "../util/type/type"
import { Response, NextFunction } from "express"

export class ProfileController {
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: CreateProfileRequest = req.body as CreateProfileRequest
            const response = await ProfileService.create(req.user!, request)
            res.status(201).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const profileId = req.params.id
            const response = await ProfileService.get(req.user!, profileId)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateProfileRequest = req.body as UpdateProfileRequest
            request.id = req.params.id
            const response = await ProfileService.update(req.user!, request)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async delete(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const profileId = req.params.id
            await ProfileService.delete(req.user!, profileId)
            res.status(200).json({
                data: "OK"
            })
        } catch (error) {
            next(error)
        }
    }

    static async uploadPicture(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const profilePictureResponse = await ProfileService.uploadProfilePicture(req.user!, req.file!)
            res.status(200).json({
                data: profilePictureResponse
            })
        } catch (error) {
            next(error)
        }
    }
}