import { Profile } from "@prisma/client"

export type ProfileResponse = {
    id: string
    firstName: string
    lastName: string
    bio?: string | null
    profilePicture?: string | null
    dateOfBirth?: Date | null
    location?: string | null
}

export type CreateProfileRequest = {
    firstName: string
    lastName: string
    bio?: string
    profilePicture?: string
    dateOfBirth?: Date
    location?: string
}

export type UpdateProfileRequest = {
    id: string
    firstName?: string
    lastName?: string
    bio?: string
    profilePicture?: string
    dateOfBirth?: Date
    location?: string
}

export function toProfileResponse(profile: Profile): ProfileResponse {
    return {
        id: profile.id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        bio: profile.bio,
        profilePicture: profile.profilePicture,
        dateOfBirth: profile.dateOfBirth,
        location: profile.location
    }
}