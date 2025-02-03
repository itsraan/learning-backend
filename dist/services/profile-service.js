"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const profile_model_1 = require("../models/profile-model");
const validation_1 = require("../util/validation/validation");
const profile_validation_1 = require("../util/validation/profile-validation");
const database_1 = require("../app/database");
const error_1 = require("../util/error/error");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(__dirname, "../../public/images");
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}${path_1.default.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new error_1.ResponseError(400, 'Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false);
    }
};
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Batasan 5MB
    }
});
class ProfileService {
    static create(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(profile_validation_1.ProfileValidation.CREATE, request);
            const existingProfile = yield database_1.prismaClient.profile.findUnique({
                where: {
                    userId: user.id
                }
            });
            if (existingProfile) {
                throw new error_1.ResponseError(400, "Profile already exists");
            }
            const recordData = Object.assign(Object.assign({}, createRequest), { userId: user.id });
            const createResponse = yield database_1.prismaClient.profile.create({
                data: recordData
            });
            return (0, profile_model_1.toProfileResponse)(createResponse);
        });
    }
    static checkProfileMustBeExists(userId, profileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield database_1.prismaClient.profile.findFirst({
                where: {
                    id: profileId,
                    userId: userId
                }
            });
            if (!profile) {
                throw new error_1.ResponseError(404, "Profile not found");
            }
            return profile;
        });
    }
    static get(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield this.checkProfileMustBeExists(user.id, id);
            return (0, profile_model_1.toProfileResponse)(profile);
        });
    }
    static update(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateRequest = validation_1.Validation.validate(profile_validation_1.ProfileValidation.UPDATE, request);
            yield this.checkProfileMustBeExists(user.id, updateRequest.id);
            const updateData = Object.keys(updateRequest).reduce((data, key) => {
                if (updateRequest[key] !== undefined) {
                    data[key] = updateRequest[key];
                }
                return data;
            }, {});
            const updateResponse = yield database_1.prismaClient.profile.update({
                where: { id: updateRequest.id },
                data: updateData,
            });
            return (0, profile_model_1.toProfileResponse)(updateResponse);
        });
    }
    static delete(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkProfileMustBeExists(user.id, id);
            const profile = yield database_1.prismaClient.profile.findUnique({
                where: {
                    id: id,
                    userId: user.id
                }
            });
            if (profile === null || profile === void 0 ? void 0 : profile.profilePicture) {
                const filePath = path_1.default.join(__dirname, '../../public/images', profile.profilePicture);
                if (fs_1.default.existsSync(filePath)) {
                    fs_1.default.unlinkSync(filePath);
                }
            }
            const deleteResponse = yield database_1.prismaClient.profile.delete({
                where: {
                    id: id,
                    userId: user.id
                }
            });
            return (0, profile_model_1.toProfileResponse)(deleteResponse);
        });
    }
    static uploadProfilePicture(user, file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!file) {
                throw new error_1.ResponseError(400, 'No file uploaded');
            }
            const profile = yield database_1.prismaClient.profile.findUnique({
                where: { userId: user.id }
            });
            if (!profile) {
                throw new error_1.ResponseError(404, 'Profile not found');
            }
            if (profile.profilePicture) {
                const oldFilePath = path_1.default.join(__dirname, '../../public/images', profile.profilePicture);
                if (fs_1.default.existsSync(oldFilePath)) {
                    fs_1.default.unlinkSync(oldFilePath);
                }
            }
            const updatedProfile = yield database_1.prismaClient.profile.update({
                where: { userId: user.id },
                data: {
                    profilePicture: file.filename
                }
            });
            return (0, profile_model_1.toProfileResponse)(updatedProfile);
        });
    }
}
exports.ProfileService = ProfileService;
ProfileService.uploadMiddleware = upload.single('profilePicture');
