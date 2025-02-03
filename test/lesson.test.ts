import { LessonTest, UserTest, CourseTest, ModuleTest } from "./test-util"
import { logger } from "../src/app/logging"
import { app } from "../src/app/service"
import supertest from "supertest"

describe('POST /api/module/:id/lesson', () => {
    let token: string
    let authorId: string
    let courseId: string
    let moduleId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        authorId = user.id
        const course = await CourseTest.create(authorId)
        courseId = course.id
        const module = await ModuleTest.create(courseId)
        moduleId = module.id
        await LessonTest.create(moduleId)
    })

    afterEach(async () => {
        await LessonTest.delete()
        await ModuleTest.delete()
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able to create new lesson', async () => {
        const response = await supertest(app)
            .post(`/api/module/${moduleId}/lesson`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "coba",
                content: "coba",
                videoUrl: "coba",
                resourceUrls: "coba",
                order: 2
            })
        
        logger.debug(response.body)
        expect(response.status).toBe(201)
        expect(response.body.data.title).toBe("coba")
        expect(response.body.data.content).toBe("coba")
        expect(response.body.data.videoUrl).toBe("coba")
        expect(response.body.data.resourceUrls).toBe("coba")
        expect(response.body.data.order).toBe(2)  
    })

    it('should reject create new lesson if data is invalid', async () => {
        const response = await supertest(app)
            .post(`/api/module/${moduleId}/lesson`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "",
                content: "",
                videoUrl: "",
                resourceUrls: "",
                order: 1
            })
        
        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject create new lesson if token is invalid', async () => {
        const response = await supertest(app)
            .post(`/api/module/${moduleId}/lesson`)
            .set("Authorization", `Bearer jomok`)
            .send({
                title: "test",
                content: "test",
                videoUrl: "test",
                resourceUrls: "test",
                order: 1
            })
        
        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject create new lesson if module not found', async () => {
        const response = await supertest(app)
            .post(`/api/module/invalid-module-id/lesson`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "test",
                content: "test",
                videoUrl: "test",
                resourceUrls: "test",
                order: 1
            })
        
        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('GET /api/lesson/:id', () => {
    let token: string
    let authorId: string
    let courseId: string
    let moduleId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        authorId = user.id
        const course = await CourseTest.create(authorId)
        courseId = course.id
        const module = await ModuleTest.create(courseId)
        moduleId = module.id
        await LessonTest.create(moduleId)
    })

    afterEach(async () => {
        await LessonTest.delete()
        await ModuleTest.delete()
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able to get lessons', async () => {
        const lesson = await LessonTest.get(moduleId)
        const response = await supertest(app)
            .get(`/api/lesson/${lesson.id}`)
            .set("Authorization", `Bearer ${token}`)
        
        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.title).toBe("test")
        expect(response.body.data.content).toBe("test")
        expect(response.body.data.videoUrl).toBe("test")
        expect(response.body.data.resourceUrls).toBe("test")
        expect(response.body.data.order).toBe(1)
    })

    it('should reject lesson if token is invalid', async () => {
        const lesson = await LessonTest.get(moduleId)
        const response = await supertest(app)
            .get(`/api/lesson/${lesson.id}`)
            .set("Authorization", `Bearer ciwiw`)
        
        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject lesson if lesson not found', async () => {
        const lesson = await LessonTest.get(moduleId)
        const response = await supertest(app)
            .get(`/api/lesson/cihuy`)
            .set("Authorization", `Bearer ${token}`)
        
        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('GET /api/module/:id/lesson', () => {
    let token: string
    let authorId: string
    let courseId: string
    let moduleId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        authorId = user.id
        const course = await CourseTest.create(authorId)
        courseId = course.id
        const module = await ModuleTest.create(courseId)
        moduleId = module.id

        await LessonTest.create(moduleId, {
            title: "coba",
            content: "coba",
            videoUrl: "coba",
            resourceUrls: "coba",
            order: 1
        })

        await LessonTest.create(moduleId, {
            title: "test2",
            content: "test2",
            videoUrl: "test2",
            resourceUrls: "test2",
            order: 2
        })
    })

    afterEach(async () => {
        await LessonTest.delete()
        await ModuleTest.delete()
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able get all lesson', async () => {
        const response = await supertest(app)
            .get(`/api/module/${moduleId}/lesson`)
            .set("Authorization", `Bearer ${token}`)

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.length).toBe(2)
        expect(Array.isArray(response.body.data)).toBe(true)
        
        const [lesson1, lesson2] = response.body.data

        expect(lesson1.title).toBe("coba")
        expect(lesson1.content).toBe("coba")
        expect(lesson1.videoUrl).toBe("coba")
        expect(lesson1.resourceUrls).toBe("coba")
        expect(lesson1.order).toBe(1)

        expect(lesson2.title).toBe("test2")
        expect(lesson2.content).toBe("test2")
        expect(lesson2.videoUrl).toBe("test2")
        expect(lesson2.resourceUrls).toBe("test2")
        expect(lesson2.order).toBe(2)
    })

    it('should reejct get all lesson if token is invalid', async () => {
        const response = await supertest(app)
            .get(`/api/module/${moduleId}/lesson`)
            .set("Authorization", `Bearer test`)

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject get all lesson if module not found', async () => {
        const response = await supertest(app)
            .get(`/api/module/aduhay/lesson`)
            .set("Authorization", `Bearer ${token}`)

        logger.debug(response.body)
        expect(response.status).toBe(403)
        expect(response.body.errors).toBeDefined()
    })
})

describe('PATCH /api/lesson/:id', () => {
    let token: string
    let authorId: string
    let courseId: string
    let moduleId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        authorId = user.id
        const course = await CourseTest.create(authorId)
        courseId = course.id
        const module = await ModuleTest.create(courseId)
        moduleId = module.id
        await LessonTest.create(moduleId)
    })

    afterEach(async () => {
        await LessonTest.delete()
        await ModuleTest.delete()
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able to update lesson', async () => {
        const lesson = await LessonTest.get(moduleId)
        const response = await supertest(app)
            .patch(`/api/lesson/${lesson.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "test",
                content: "test",
                videoUrl: "test",
                resourceUrls: "test",
                order: 7
            })

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.title).toBe("test")
        expect(response.body.data.content).toBe("test")
        expect(response.body.data.videoUrl).toBe("test")
        expect(response.body.data.resourceUrls).toBe("test")
        expect(response.body.data.order).toBe(7)
    })

    it('should reject update lesson if token is invalid', async () => {
        const lesson = await LessonTest.get(moduleId)
        const response = await supertest(app)
            .patch(`/api/lesson/${lesson.id}`)
            .set("Authorization", `Bearer test`)
            .send({
                title: "test",
                content: "test",
                videoUrl: "test",
                resourceUrls: "test",
                order: 7
            })

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject update lesson if lesson not found', async () => {
        const response = await supertest(app)
            .patch(`/api/lesson/cihuy`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "test",
                content: "test",
                videoUrl: "test",
                resourceUrls: "test",
                order: 7
            })

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('DELETE /api/lesson/:id', () => {
    let token: string
    let authorId: string
    let courseId: string
    let moduleId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        authorId = user.id
        const course = await CourseTest.create(authorId)
        courseId = course.id
        const module = await ModuleTest.create(courseId)
        moduleId = module.id
        await LessonTest.create(moduleId)
    })

    afterEach(async () => {
        await LessonTest.delete()
        await ModuleTest.delete()
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able to delete lesson', async () => {
        const lesson = await LessonTest.get(moduleId)
        const response = await supertest(app)
            .delete(`/api/lesson/${lesson.id}`)
            .set("Authorization", `Bearer ${token}`)

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data).toBe("OK")
    })

    it('should reject delete lesson if token is invalid', async () => {
        const lesson = await LessonTest.get(moduleId)
        const response = await supertest(app)
            .delete(`/api/lesson/${lesson.id}`)
            .set("Authorization", `Bearer test`)
        
        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject delete lesson if lesson not found', async () => {
        const response = await supertest(app)
            .delete(`/api/lesson/cihuy`)
            .set("Authorization", `Bearer ${token}`)
        
        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})