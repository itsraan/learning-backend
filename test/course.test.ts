import { CourseTest, UserTest } from "./test-util"
import { logger } from "../src/app/logging"
import { app } from "../src/app/service"
import supertest from "supertest"

describe('POST /api/course', () => {
    let token: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
    })

    afterEach(async () => {
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should create new course', async () => {
        const response = await supertest(app)
            .post("/api/course")
            .set("Authorization", `Bearer ${token}`) 
            .send({
                title: "test",
                description: "test",
                category: "test",
                level: "BEGINNER",
                price: 14000
            })

        logger.debug(response.body)
        expect(response.status).toBe(201)
        expect(response.body.data.title).toBe("test")
        expect(response.body.data.description).toBe("test")
        expect(response.body.data.category).toBe("test")
        expect(response.body.data.price).toBe(14000)
        expect(response.body.data.level).toBe("BEGINNER")
    })

    it('should reject create new course if data is invalid', async () => {
        const response = await supertest(app)
            .post("/api/course")
            .set("Authorization", `Bearer ${token}`) 
            .send({
                title: "",
                description: "",
                category: "",
                level: "",
                price: 0
            })

        logger.debug(response.body)
        expect(response.status).toBe(400)
    })
})

describe('GET /api/course/:id', () => {
    let token: string
    let authorId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        authorId = user.id
        await CourseTest.create(authorId)
    })

    afterEach(async () => {
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able to get course', async () => {
        const course = await CourseTest.get(authorId)
        const response = await supertest(app)
            .get(`/api/course/${course.id}`)
            .set("Authorization", `Bearer ${token}`)

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.title).toBe(course.title)
        expect(response.body.data.description).toBe(course.description)
        expect(response.body.data.category).toBe(course.category)
        expect(response.body.data.price).toBe(course.price)
        expect(response.body.data.level).toBe(course.level)
    })

    it('should reject get course if course is not found', async () => {
        const response = await supertest(app)
            .get(`/api/course/invalid-id`)
            .set("Authorization", `Bearer ${token}`)

        logger.debug(response.body)
        expect(response.status).toBe(404)
    })
})

describe('GET /api/courses', () => {
    let token: string
    let authorId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        authorId = user.id

        await CourseTest.create(authorId, {
            title: "test",
            description: "test",
            category: "test",
            level: "BEGINNER",
            price: 14000
        })

        await CourseTest.create(authorId, {
            title: "coba",
            description: "coba",
            category: "coba",
            level: "INTERMEDIATE",
            price: 14000
        })
    })

    afterEach(async () => {
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able get all course', async () => {
        const response = await supertest(app)
            .get("/api/courses")
            .set("Authorization", `Bearer ${token}`)

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.length).toBe(2)
        expect(Array.isArray(response.body.data)).toBe(true)

        const [course1, course2] = response.body.data

        expect(course1.title).toBe("test")
        expect(course1.description).toBe("test")
        expect(course1.category).toBe("test")
        expect(course1.price).toBe(14000)
        expect(course1.level).toBe("BEGINNER")

        expect(course2.title).toBe("coba")
        expect(course2.description).toBe("coba")
        expect(course2.category).toBe("coba")
        expect(course2.price).toBe(14000)
        expect(course2.level).toBe("INTERMEDIATE")
    })

    it('should reject get all course if token is invalid', async () => {
        const response = await supertest(app)
            .get("/api/courses")
            .set("Authorization", `Bearer abogoboga`)

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(Array.isArray(response.body.errors)).toBeDefined()
    })
})

describe('PATCH /api/course/:id', () => {
    let token: string
    let authorId: string
    let courseId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        authorId = user.id
        await CourseTest.create(authorId)
        courseId = (await CourseTest.get(authorId)).id
    })

    afterEach(async () => {
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able to update course', async () => {
        const response = await supertest(app)
            .patch(`/api/course/${courseId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "update",
                description: "update",
                category: "update",
                level: "BEGINNER",
                price: 14000
            })

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.title).toBe("update")
        expect(response.body.data.description).toBe("update")
        expect(response.body.data.category).toBe("update")
        expect(response.body.data.price).toBe(14000)
        expect(response.body.data.level).toBe("BEGINNER")
    })

    it('should reject update course if token is invalid', async () => {
        const course = await CourseTest.get(authorId)
        const response = await supertest(app)
            .patch(`/api/course/${course.id}`)
            .set("Authorization", `Bearer error`)
            .send({
                title: "update",
                description: "update",
                category: "update",
                level: "BEGINNER",
                price: 14000
            })  

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('DELETE /api/course/:id', () => {
    let token: string
    let authorId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        authorId = user.id
        await CourseTest.create(authorId)
    })

    afterEach(async () => {
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able to remove course', async () => {
        const course = await CourseTest.get(authorId)
        const response = await supertest(app)
            .delete(`/api/course/${course.id}`)
            .set("Authorization", `Bearer ${token}`)

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data).toBe("OK")
    })

    it('should reject remove course if token is invalid', async () => {
        const course = await CourseTest.get(authorId)
        const response = await supertest(app)
            .delete(`/api/course/${course.id}`)
            .set("Authorization", `Bearer error`)

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

