import { prismaClient } from "../src/app/database"
import { Course, Profile, User } from "@prisma/client"
import { CourseLevel } from "@prisma/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export class UserTest {
    static async delete() {
        await prismaClient.user.deleteMany({
            where: { email: "test@gmail.com" }
        })
    }

    static async create() {
        const user = await prismaClient.user.create({
            data: {
                username: "test",
                email: "test@gmail.com",
                password: await bcrypt.hash("test", 10),
                role: "INSTRUCTOR"
                
            }
        })

        const token = jwt.sign({
            id: user.id,
            username: user.username,
            email: user.email
        }, process.env.JWT_SECRET_KEY!, {expiresIn: process.env.EXPIRED})

        const updateUser = await prismaClient.user.update({
            where: { id: user.id },data: { token: token }
        })

        return updateUser
    }

    static async get() {
        const user = await prismaClient.user.findUnique({
            where: { email: "test@gmail.com" }
        })

        if(!user) {
            throw new Error("User not found")
        }

        return user
    }
}

export class ProfileTest {
    static async delete() {
        await prismaClient.profile.deleteMany({
            where: {
                user: {
                    username: "test"
                }
            }
        })
    }

    static async create(userId: string) {
        await prismaClient.profile.create({
            data: {
                userId: userId,
                firstName: "test",
                lastName: "test",
                bio: "test",
                dateOfBirth: new Date("2025-01-01"),
                location: "sungki"
            }
        })
    }

    static async get(userId: string): Promise<Profile> {
        const profile = await prismaClient.profile.findFirst({
            where: {
                userId: userId
            }
        })

        if(!profile) {
            throw new Error("Profile not found")
        }
        return profile
    }
}

export class CourseTest {
    static async delete() {
        await prismaClient.course.deleteMany({
            where: {
                author: {
                    username: "test"
                }
            }
        })
    }

    static async create(authorId: string, data: Partial<{ title: string, description: string, category: string, level: CourseLevel, price: number }> = {}) {
        const course = await prismaClient.course.create({
            data: {
                title: data.title || "test",
                description: data.description || "test",
                category: data.category || "test",
                level: data.level || "BEGINNER",
                price: data.price || 14000,
                author: {
                    connect: {
                        id: authorId
                    }
                }
            }
        })
        return course
    }

    static async get(authorId: string): Promise<Course> {
        const course = await prismaClient.course.findFirst({
            where: {
                authorId: authorId
            }
        })

        if(!course) {
            throw new Error("Course not found")
        }

        return course
    }
}

export class ModuleTest {
    static async delete() {
        await prismaClient.module.deleteMany({
            where: {
                course: {
                    author: {
                        username: "test"
                    }
                }
            }
        })
    }

    static async create(courseId: string, data: Partial<{ title: string, order: number, description: string }> = {}) {
        const module = await prismaClient.module.create({
            data: {
                title: data.title || "test",
                description: data.description || "test",
                order: data.order || 1,
                course: {
                    connect: {
                        id: courseId
                    }
                }
            }
        })
        return module
    }

    static async get(courseId: string) {
        const module = await prismaClient.module.findFirst({
            where: {
                courseId: courseId
            }
        })

        if (!module) {
            throw new Error("Module not found")
        }

        return module
    }
}

export class LessonTest {
    static async delete() {
        await prismaClient.lesson.deleteMany({
            where: {
                module: {
                    course: {
                        author: {
                            username: "test"
                        }
                    }
                }
            }
        })
    }

    static async create(moduleId: string, data: Partial<{ title: string, content: string, videoUrl: string, resourceUrls: string, order: number }> = {}) {
        const lesson = await prismaClient.lesson.create({
            data: {
                title: data.title || "test",
                content: data.content || "test",
                videoUrl: data.videoUrl || "test",
                resourceUrls: data.resourceUrls || "test",
                order: data.order || 1,
                moduleId: moduleId
            }
        })
        return lesson
    }

    static async get(moduleId: string) {
        const lesson = await prismaClient.lesson.findFirst({
            where: {
                moduleId: moduleId
            }
        })

        if (!lesson) {
            throw new Error("Lesson not found")
        }

        return lesson
    }
}

export class EnrollmentTest {
    static async delete() {
        await prismaClient.enrollment.deleteMany({
            where: {
                user: {
                    username: "test"
                }
            }
        })
    }

    static async create(userId: string, courseId: string, data: Partial<{ enrolledAt: Date, completedAt: Date | null }> = {}) {
        const enrollment = await prismaClient.enrollment.create({
            data: {
                userId,
                courseId,
                enrolledAt: data.enrolledAt || new Date(),
                completedAt: data.completedAt || null
            }
        })
        return enrollment
    }

    static async get(userId: string, courseId: string) {
        const enrollment = await prismaClient.enrollment.findFirst({
            where: {
                userId,
                courseId
            }
        })

        if (!enrollment) {
            throw new Error("Enrollment not found")
        }

        return enrollment
    }
}

export class AssignmentTest {
    static async delete() {
        await prismaClient.assignment.deleteMany({
            where: {
                author: {
                    username: "test"
                }
            }
        })
    }

    static async create(authorId: string, lessonId: string, data: Partial<{ title: string, description: string, maxScore: number, dueDate: Date }> = {}) {
        const assignment = await prismaClient.assignment.create({
            data: {
                authorId,
                lessonId,
                title: data.title || "test",
                description: data.description || "test",
                maxScore: data.maxScore || 100,
                dueDate: data.dueDate || new Date()
            }
        })
        return assignment
    }

    static async get(authorId: string, lessonId: string) {
        const assignment = await prismaClient.assignment.findFirst({
            where: {
                authorId,
                lessonId
            }
        })

        if(!assignment) {
            throw new Error("Assignment not found")
        }

        return assignment
    }
}
