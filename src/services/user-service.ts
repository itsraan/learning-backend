import { CreateUserRequest, UpdateUserRequest, LoginUserRequest, UserResponse, toUserResponse } from "../models/user-model"
import { Validation } from "../util/validation/validation"
import { UserValidation } from "../util/validation/user-validation"
import { prismaClient } from "../app/database"
import { ResponseError } from "../util/error/error"
import { User } from "@prisma/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export class UserService {
    static async register(request: CreateUserRequest): Promise<UserResponse> {
        const registerRequest = Validation.validate(UserValidation.REGISTER, request)
        const existingUser = await prismaClient.user.findFirst({
            where: {
                OR: [
                    { email: registerRequest.email },
                    { username: registerRequest.username }
                ]
            }
        })        

        if(existingUser) {
            if(existingUser.email === registerRequest.email) {
                throw new ResponseError(400, "Email already exists")
            }
            if(existingUser.username === registerRequest.username) {
                throw new ResponseError(400, "Username already exists")
            }
        }

        const hashedPassword = await bcrypt.hash(registerRequest.password, 10)
        const userResponse = await prismaClient.user.create({
            data: {
                username: registerRequest.username,
                email: registerRequest.email,
                password: hashedPassword,
                role: registerRequest.role || "STUDENT"
            }
        })

        return toUserResponse(userResponse)
    }

    static async get(user: User): Promise<UserResponse> {
        return toUserResponse(user)
    }

    static async getAll(): Promise<UserResponse[]> {
        const users = await prismaClient.user.findMany()
        return users.map(toUserResponse)
    }

    static async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
        const updateRequest = Validation.validate(UserValidation.UPDATE, request)
        const updateData: any = {}

        if(updateRequest.username) {
            updateData.username = updateRequest.username
        }

        if(updateRequest.password) {
            updateData.password= await bcrypt.hash(updateRequest.password, 10)
            
        }

        const updateResponse = await prismaClient.user.update({
            where: {
                id: user.id
            },
            data: updateData
        })

        return toUserResponse(updateResponse)
    }

    static async delete(id: string): Promise<UserResponse> {
        const deleteResponse = await prismaClient.user.delete({
            where: {
                id
            }
        })

        return toUserResponse(deleteResponse)
    }

    static async login(request: LoginUserRequest): Promise<UserResponse> {
        const loginRequest = Validation.validate(UserValidation.LOGIN, request)
        let user = await prismaClient.user.findUnique({
            where: {
                email: loginRequest.email
            }
        })

        if(!user) {
            throw new ResponseError(400, "Email or Password invalid")
        }

        const comparePassword = await bcrypt.compare(loginRequest.password, user.password)
        if(!comparePassword) {
            throw new ResponseError(400, "Email or Password invalid")
        }

        const token = jwt.sign({
            id: user.id,
            username: user.username,
            email: user.email,
        }, process.env.JWT_SECRET_KEY!, { expiresIn: process.env.EXPIRED })

        user = await prismaClient.user.update({
            where: {
                id: user.id
            },
            data: {
                token
            }
        })

        return toUserResponse(user)
    }

    static async logout(user: User): Promise<UserResponse> {
        const logoutResponse = await prismaClient.user.update({
            where: { id: user.id }, data: { token: null }
        })

        return toUserResponse(logoutResponse)
    }
}