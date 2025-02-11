import { EnrollmentTest, UserTest, CourseTest } from "./test-util"
import { logger } from "../src/app/logging"
import { app } from "../src/app/service"
import supertest from "supertest"

describe('POST /api/course/:id/enroll', () => {
    let token: string
    let userId: string
    let instructorId: string
    let courseId: string

    beforeEach(async () => {
        const student = await UserTest.create({
            username: "student",
            email: "student@gmail.com",
            password: "student",
            role: "STUDENT"
        })

        token = student.token!
        userId = student.id

        const instructor = await UserTest.create({
            username: "instructor",
            email: "instructor@gmail.com",
            password: "instructor",
            role: "INSTRUCTOR"
        })

        instructorId = instructor.id

        const course = await CourseTest.create(instructorId)
        courseId = course.id
    })

    afterEach(async () => {
        await EnrollmentTest.delete()
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able to enroll a course', async () => {
        const response = await supertest(app)
            .post(`/api/course/${courseId}/enroll`)
            .set("Authorization", `Bearer ${token}`)
            .send({ userId })

        console.log(response.body)
        logger.debug(response.body)
        expect(response.status).toBe(201)
        expect(response.body.data.userId).toBe(userId)
        expect(response.body.data.courseId).toBe(courseId)
    })

    it('should reject enroll a course if token is invalid', async () => {
        const response = await supertest(app)
            .post(`/api/course/${courseId}/enroll`)
            .set("Authorization", `Bearer invalid`)

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject enroll a course if course not found', async  () => {
        const response = await supertest(app)
            .post(`/api/course/invalid/enroll`)
            .set("Authorization", `Bearer ${token}`)

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject enroll a course if user not found', async () => {
        const response = await supertest(app)
            .post(`/api/course/${courseId}/enroll`)
            .set("Authorization", `Bearer ${token+1}`)
            .send()
        
        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('GET /api/enrollments', () => {
    let token: string
    let userId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        userId = user.id
        const course = await CourseTest.create(userId)
        await EnrollmentTest.create(userId, course.id)
    })

    afterEach(async () => {
        await EnrollmentTest.delete()
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able to get all enrollments', async () => {
        const response = await supertest(app)
            .get(`/api/enrollments`)
            .set("Authorization", `Bearer ${token}`)

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(Array.isArray(response.body.data)).toBe(true)
    })

    it('should reject get all enrollments if token is invalid', async () => {
        const response = await supertest(app)
            .get(`/api/enrollments`)
            .set("Authorization", `Bearer invalid`)

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('GET /api/enrollment/:id', () => {
    let token: string
    let userId: string
    let enrollmentId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        userId = user.id
        const course = await CourseTest.create(userId)
        const enrollment = await EnrollmentTest.create(userId, course.id)
        enrollmentId = enrollment.id
    })

    afterEach(async () => {
        await EnrollmentTest.delete()
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able to get an enrollment', async () => {
        const response = await supertest(app)
            .get(`/api/enrollment/${enrollmentId}`)
            .set("Authorization", `Bearer ${token}`)

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.id).toBe(enrollmentId)
    })

    it('should reject get an enrollment if token is invalid', async () => {
        const response = await supertest(app)
            .get(`/api/enrollment/${enrollmentId}`)
            .set("Authorization", `Bearer invalid`)

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject get an enrollment if enrollment not found', async () => {
        const response = await supertest(app)
            .get(`/api/enrollment/invalid`)
            .set("Authorization", `Bearer ${token}`)

        logger.debug(response.body)
        expect(response.status).toBe(404)
        expect(response.body.errors).toBeDefined()
    })
})

describe('PATCH /api/enrollment/:id', () => {
    let token: string
    let userId: string
    let enrollmentId: string

    beforeEach(async () => {
        const user = await UserTest.create({
            username: "admin",
            email: "admin@gmail.com",
            password: "admin",
            role: "ADMIN"
        })
        token = user.token!
        userId = user.id
        const course = await CourseTest.create(userId)
        const enrollment = await EnrollmentTest.create(userId, course.id)
        enrollmentId = enrollment.id
    })

    afterEach(async () => {
        await EnrollmentTest.delete()
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able to update an enrollment', async () => {
        const response = await supertest(app)
            .patch(`/api/enrollment/${enrollmentId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ completedAt: "2025-01-01" })

        console.log(response.body)
        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.completedAt).toBe("2025-01-01T00:00:00.000Z")
    })

    it('should reject update an enrollment if token is invalid', async () => {
        const response = await supertest(app)
            .patch(`/api/enrollment/${enrollmentId}`)            
            .set("Authorization", `Bearer invalid`)
            .send({ completedAt: "2025-01-01" })
        
        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject update an enrollment if enrollment not found', async () => {
        const response = await supertest(app)
            .patch(`/api/enrollment/invalid`)
            .set("Authorization", `Bearer ${token}`)

        logger.debug(response.body)
        expect(response.status).toBe(404)
        expect(response.body.errors).toBeDefined()
    })

    it('should reejct update an enrollment if completedAt is invalid', async () => {
        const response = await supertest(app)
            .patch(`/api/enrollment/${enrollmentId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ completedAt: "invalid" })

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('DELETE /api/enrollment/:id', () => {
    let token: string
    let userId: string
    let enrollmentId: string

    beforeEach(async () => {
        const user = await UserTest.create({
            username: "admin",
            email: "admin@gmail.com",
            password: "admin",
            role: "ADMIN"
        })
        token = user.token!
        userId = user.id
        const course = await CourseTest.create(userId)
        const enrollment = await EnrollmentTest.create(userId, course.id)
        enrollmentId = enrollment.id
    })

    afterEach(async () => {
        await EnrollmentTest.delete()
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able to delete an enrollment', async () => {
        const response = await supertest(app)
            .delete(`/api/enrollment/${enrollmentId}`)
            .set("Authorization", `Bearer ${token}`)

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data).toBe("OK")
    })

    it('should reject delete an enrollment if token is invalid', async () => {
        const response = await supertest(app)
            .delete(`/api/enrollment/${enrollmentId}`)
            .set("Authorization", `Bearer invalid`)

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
    
    it('should reject delete an enrollment if enrollment not found', async () => {
        const response = await supertest(app)
            .delete(`/api/enrollment/invalid`)
            .set("Authorization", `Bearer ${token}`)

        logger.debug(response.body)
        expect(response.status).toBe(404)
        expect(response.body.errors).toBeDefined()
    })
})

describe('GET /api/enrollments/bycourse/:id', () => {
    let token: string
    let userId: string
    let courseId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        userId = user.id
        const course = await CourseTest.create(userId)
        courseId = course.id
        await EnrollmentTest.create(userId, courseId)
    })

    afterEach(async () => {
        await EnrollmentTest.delete()
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able to get enrollments by course', async () => {
        const response = await supertest(app)
            .get(`/api/enrollments/bycourse/${courseId}`)
            .set("Authorization", `Bearer ${token}`)

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(Array.isArray(response.body.data)).toBe(true)
    })

    it('should reject get enrollments by course if token is invalid', async () => {
        const response = await supertest(app)
            .get(`/api/enrollments/bycourse/${courseId}`)
            .set("Authorization", `Bearer invalid`)

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject get enrollments by course if course not found', async () => {
        const response = await supertest(app)
            .get(`/api/enrollments/bycourse/invalid`)
            .set("Authorization", `Bearer dakdj`)

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})
