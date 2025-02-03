import { ModuleTest, UserTest, CourseTest } from "./test-util"
import { logger } from "../src/app/logging"
import { app } from "../src/app/service"
import supertest from "supertest"

describe('POST /api/course/:id/module', () => {
    let token: string
    let authorId: string
    let courseId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        authorId = user.id
        const course = await CourseTest.create(authorId)
        courseId = course.id
        await ModuleTest.create(courseId)
    })

    afterEach(async () => {
        await ModuleTest.delete()
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should create new module', async () => {
        const response = await supertest(app)
            .post(`/api/course/${courseId}/module`)
            .set("Authorization", `Bearer ${token}`) 
            .send({
                title: "coba",
                description: "coba",
                order: 2
            })

        logger.debug(response.body)
        expect(response.status).toBe(201)
        expect(response.body.data.title).toBe("coba")
        expect(response.body.data.description).toBe("coba")
        expect(response.body.data.order).toBe(2)
    })

    it('should reject create new module if data is invalid', async () => {
        const response = await supertest(app)
            .post(`/api/course/${courseId}/module`)
            .set("Authorization", `Bearer ${token}`) 
            .send({
                title: "",
                description: "",
                order: 1
            })

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject if course not found', async () => {
        const response = await supertest(app)
            .post(`/api/course/invalid-course-id/module`)
            .set("Authorization", `Bearer ${token}`) 
            .send({
                title: "coba",
                description: "coba",
                order: 1
            })

        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('GET /api/module/:id', () => {
    let token: string
    let authorId: string
    let courseId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        authorId = user.id
        const course = await CourseTest.create(authorId)
        courseId = course.id
        await ModuleTest.create(courseId)
    })

    afterEach(async () => {
        await ModuleTest.delete()
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able to get modules', async () => {
        const module = await ModuleTest.create(courseId)
        const response = await supertest(app)
            .get(`/api/module/${module.id}`)
            .set("Authorization", `Bearer ${token}`)

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.title).toBe("test")
        expect(response.body.data.description).toBe("test")
        expect(response.body.data.order).toBe(1)
    })

    it('should reejct get modules if course not found', async () => {
        const response = await supertest(app)
            .get(`/api/module/invalid-course-id`)
            .set("Authorization", `Bearer ${token}`)

        logger.debug(response.body)
        expect(response.status).toBe(404)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject get modules if token is invalid', async () => {
        const module = await ModuleTest.create(courseId)
        const response = await supertest(app)
            .get(`/api/module/${module.id}`)
            .set("Authorization", `Bearer ini token`)

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('GET /api/course/:id/module', () => {
    let token: string
    let authorId: string
    let courseId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        authorId = user.id
        const course = await CourseTest.create(authorId)
        courseId = course.id

        await ModuleTest.create(courseId, {
            title: "coba",
            description: "coba",
            order: 3
        })

        await ModuleTest.create(courseId, {
            title: "trying",
            description: "trying",
            order: 4
        })
    })

    afterEach(async () => {
        await ModuleTest.delete()
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able get all module', async () => {
        const response = await supertest(app)
            .get(`/api/course/${courseId}/module`)
            .set("Authorization", `Bearer ${token}`)

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.length).toBe(2)
        expect(Array.isArray(response.body.data)).toBe(true)

        const [module1, module2] = response.body.data

        expect(module1.title).toBe("coba")
        expect(module1.description).toBe("coba")
        expect(module1.order).toBe(3)

        expect(module2.title).toBe("trying")
        expect(module2.description).toBe("trying")
        expect(module2.order).toBe(4)
    })

    it('should reject get all module if token is invalid', async () => {
        const response = await supertest(app)
            .get(`/api/course/${courseId}/module`)
            .set("Authorization", `Bearer ini token`)

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject get all module if course not found', async () => {
        const response = await supertest(app)
            .get(`/api/course/invalid-course-id/module`)
            .set("Authorization", `Bearer ${token}`)

        logger.debug(response.body)
        expect(response.status).toBe(403)
        expect(response.body.errors).toBeDefined()
    })
})

describe('PATCH /api/module/:id', () => {
    let token: string
    let authorId: string
    let courseId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        authorId = user.id
        const course = await CourseTest.create(authorId)
        courseId = course.id
        await ModuleTest.create(courseId)
    })

    afterEach(async () => {
        await ModuleTest.delete()
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able to update module', async () => {
        const module = await ModuleTest.get(courseId)
        const response = await supertest(app)
            .patch(`/api/module/${module.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "test",
                description: "test",
                order: 7
            })

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.title).toBe("test")
        expect(response.body.data.description).toBe("test")
        expect(response.body.data.order).toBe(7)
    })

    it('should reject update module if token is invalid', async () => {
        const module = await ModuleTest.get(courseId)
        const response = await supertest(app)
            .patch(`/api/module/${module.id}`)
            .set("Authorization", `Bearer ini token`)
            .send({
                title: "test",
                description: "test",
                order: 1
            })

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject update module if module not found', async () => {
        const response = await supertest(app)
            .patch(`/api/module/invalid-module-id`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "test",
                description: "test",
                order: 1
            })

        logger.debug(response.body)
        expect(response.status).toBe(404)
        expect(response.body.errors).toBeDefined()
    })
})

describe('DELETE /api/module/:id', () => {
    let token: string
    let authorId: string
    let courseId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        authorId = user.id
        const course = await CourseTest.create(authorId)
        courseId = course.id
        await ModuleTest.create(courseId)
    })

    afterEach(async () => {
        await ModuleTest.delete()
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able delete module', async () => {
        const module = await ModuleTest.get(courseId)
        const response = await supertest(app)
            .delete(`/api/module/${module.id}`)
            .set("Authorization", `Bearer ${token}`)

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data).toBe("OK")
    })

    it('should reject delete module if token is invalid', async () => {
        const module = await ModuleTest.get(courseId)
        const response = await supertest(app)
            .delete(`/api/module/${module.id}`)
            .set("Authorization", `Bearer ini token`)

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject delete module if module not found', async () => {
        const response = await supertest(app)
            .delete(`/api/module/invalid-module-id`)
            .set("Authorization", `Bearer ${token}`)

        logger.debug(response.body)
        expect(response.status).toBe(404)
        expect(response.body.errors).toBeDefined()
    })
})