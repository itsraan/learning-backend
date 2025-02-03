import { User } from "@prisma/client"

export type UserResponse = {
    id: string
    username: string
    email: string
    role: string
    token?: string
}

export type CreateUserRequest = {
    username: string
    email: string
    password: string
    role?: string
}

export type LoginUserRequest = {
    email: string
    password: string
}

export type UpdateUserRequest = {
    username?: string
    password?: string
}

export function toUserResponse(user: User): UserResponse {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: user.token!
    }
}