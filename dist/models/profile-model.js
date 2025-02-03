"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toProfileResponse = toProfileResponse;
function toProfileResponse(profile) {
    return {
        id: profile.id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        bio: profile.bio,
        profilePicture: profile.profilePicture,
        dateOfBirth: profile.dateOfBirth,
        location: profile.location
    };
}
