import { AssignmentTest, UserTest, LessonTest, ModuleTest, CourseTest  } from "./test-util"
import { logger } from "../src/app/logging"
import { app } from "../src/app/service"
import supertest from "supertest"

describe('POST /api/lesson/:id/assignment', () => {
    let token: string
    let authorId: string
    let courseId: string
    let moduleId: string
    let lessonId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        authorId = user.id

        const course = await CourseTest.create(authorId)
        courseId = course.id

        const module = await ModuleTest.create(courseId)
        moduleId = module.id

        const lesson = await LessonTest.create(moduleId)
        lessonId = lesson.id
    })

    afterEach(async () => {
        await AssignmentTest.delete()
        await LessonTest.delete()
        await ModuleTest.delete()
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able to create an assignment', async () => {
        const fixedDate = new Date("2025-02-06T00:43:10.160Z")
        const response = await supertest(app)
            .post(`/api/lesson/${lessonId}/assignment`)
            .set("Authorization", `Bearer ${token}`)
            .send({  
                title: "test", 
                description: "test", 
                maxScore: 100, 
                dueDate: fixedDate 
            })

        console.log(response.body)
        logger.debug(response.body)
        expect(response.status).toBe(201)
        expect(response.body.data.title).toBe("test")
        expect(response.body.data.description).toBe("test")
        expect(response.body.data.maxScore).toBe(100)
        expect(new Date(response.body.data.dueDate).toISOString()).toBe(fixedDate.toISOString())
    })

    it('should reject create an assignment if token is invalid', async () => {
        const response = await supertest(app)
            .post(`/api/lesson/${lessonId}/assignment`)
            .set("Authorization", `Bearer invalid`)
        
        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject create an assignment if lesson not found', async () => {
        const response = await supertest(app)
            .post(`/api/lesson/invalid/assignment`)
            .set("Authorization", `Bearer ${token}`)

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('GET ALL ASSIGNMENTS /api/assignments', () => {
    let token: string
    let authorId: string
    let courseId: string
    let moduleId: string
    let lessonId: string

    beforeEach(async () => {
        const user = await UserTest.create({
            username: "student",
            email: "student@gmail.com",
            password: "student",
            role: "STUDENT"
        })

        token = user.token!
        authorId = user.id

        const course = await CourseTest.create(authorId)
        courseId = course.id

        const module = await ModuleTest.create(courseId)
        moduleId = module.id

        const lesson = await LessonTest.create(moduleId)
        lessonId = lesson.id

        await AssignmentTest.create(authorId, lessonId, {
            title: "test",
            description: "test",
            maxScore: 100,
            dueDate: new Date("2025-02-06T00:43:10.160Z")
        })

        await AssignmentTest.create(authorId, lessonId, {
            title: "coba",
            description: "coba",
            maxScore: 100,
            dueDate: new Date("2025-02-06T00:43:10.160Z")
        })
    })

    afterEach(async () => {
        await AssignmentTest.delete()
        await LessonTest.delete()
        await ModuleTest.delete()
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should get all assignments', async () => {
        const response = await supertest(app)
            .get(`/api/assignments`)
            .set("Authorization", `Bearer ${token}`)
        
        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(Array.isArray(response.body.data)).toBe(true)
        expect(response.body.data.length).toBe(2)

        const [assignment1, assignment2] = response.body.data

        expect(assignment1.title).toBe("test")
        expect(assignment1.description).toBe("test")
        expect(assignment1.maxScore).toBe(100)
        expect(new Date(assignment1.dueDate).toISOString()).toBe(new Date("2025-02-06T00:43:10.160Z").toISOString())

        expect(assignment2.title).toBe("coba")
        expect(assignment2.description).toBe("coba")
        expect(assignment2.maxScore).toBe(100)
        expect(new Date(assignment2.dueDate).toISOString()).toBe(new Date("2025-02-06T00:43:10.160Z").toISOString())
    })

    it('should reject get all assignments if token is invalid', async () => {
        const response = await supertest(app)
            .get(`/api/assignments`)
            .set("Authorization", `Bearer invalid`)
        
        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject get all assignments if user not found', async () => {
        await UserTest.delete()
        const response = await supertest(app)
            .get(`/api/assignments`)
            .set("Authorization", `Bearer ${token}`)
        
        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('GET ASSIGNMENT /api/assignment/:id', () => {
    let token: string
    let authorId: string
    let courseId: string
    let moduleId: string
    let lessonId: string
    let assignmentId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        authorId = user.id

        const course = await CourseTest.create(authorId)
        courseId = course.id

        const module = await ModuleTest.create(courseId)
        moduleId = module.id

        const lesson = await LessonTest.create(moduleId)
        lessonId = lesson.id

        const assignment = await AssignmentTest.create(authorId, lessonId, {
            title: "test",
            description: "test",
            maxScore: 100,
            dueDate: new Date("2025-02-06T00:43:10.160Z")
        })

        assignmentId = assignment.id
    })

    afterEach(async () => {
        await AssignmentTest.delete()
        await LessonTest.delete()
        await ModuleTest.delete()
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should get an assignment', async () => {
        const response = await supertest(app)
            .get(`/api/assignment/${assignmentId}`)
            .set("Authorization", `Bearer ${token}`)
        
        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.title).toBe("test")
        expect(response.body.data.description).toBe("test")
        expect(response.body.data.maxScore).toBe(100)
        expect(new Date(response.body.data.dueDate).toISOString()).toBe(new Date("2025-02-06T00:43:10.160Z").toISOString())
    })

    it('should reject get an assignment if token is invalid', async () => {
        const response = await supertest(app)
            .get(`/api/assignment/${assignmentId}`)
            .set("Authorization", `Bearer invalid`)
        
        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject get an assignment if assignment not found', async () => {
        const response = await supertest(app)
            .get(`/api/assignment/invalid`)
            .set("Authorization", `Bearer ${token}`)
        
        logger.debug(response.body)
        expect(response.status).toBe(404)
        expect(response.body.errors).toBeDefined()
    })
})

describe('PATCH /api/assignment/:id', () => {
    let token: string
    let instructorId: string
    let courseId: string
    let moduleId: string
    let lessonId: string
    let assignmentId: string

    beforeEach(async () => {
        const user = await UserTest.create({
            username: "instructor",
            email: "instructor@gmail.com",
            password: "instructor",
            role: "INSTRUCTOR"
        })

        token = user.token!
        instructorId = user.id

        const student = await UserTest.create({
            username: "student",
            email: "student@gmail.com",
            password: "student",
            role: "STUDENT"
        })

        const course = await CourseTest.create(instructorId)
        courseId = course.id

        const module = await ModuleTest.create(courseId)
        moduleId = module.id

        const lesson = await LessonTest.create(moduleId)
        lessonId = lesson.id

        const assignment = await AssignmentTest.create(student.id, lessonId, {
            title: "test",
            description: "test",
            maxScore: 100,
            dueDate: new Date("2025-02-06T00:43:10.160Z")
        })

        assignmentId = assignment.id
    })

    afterEach(async () => {
        await AssignmentTest.delete()
        await LessonTest.delete()
        await ModuleTest.delete()
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able update assignment', async () => {
        const response = await supertest(app)
            .patch(`/api/assignment/${assignmentId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "update",
                description: "update",
                maxScore: 100,
                dueDate: new Date("2025-02-06T00:43:10.160Z")
            })
        
        console.log(response.body)
        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.title).toBe("update")
        expect(response.body.data.description).toBe("update")
        expect(response.body.data.maxScore).toBe(100)
        expect(new Date(response.body.data.dueDate).toISOString()).toBe(new Date("2025-02-06T00:43:10.160Z").toISOString())
    })

    it('should reject update assignment if token is invalid', async () => {
        const response = await supertest(app)
            .patch(`/api/assignment/${assignmentId}`)
            .set("Authorization", `Bearer invalid`)
            .send({
                title: "update",
                description: "update",
                maxScore: 100,
                dueDate: new Date("2025-02-06T00:43:10.160Z")
            })
        
        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject update assignment if assignment not found', async () => {
        const response = await supertest(app)
            .patch(`/api/assignment/invalid`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "update",
                description: "update",
                maxScore: 100,
                dueDate: new Date("2025-02-06T00:43:10.160Z")
            })
        
        logger.debug(response.body)
        expect(response.status).toBe(404)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject update assignment if data is invalid', async () => {
        const response = await supertest(app)
            .patch(`/api/assignment/${assignmentId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "",
                description: "update",
                maxScore: 100,
                dueDate: new Date("2025-02-06T00:43:10.160Z")
            })
        
        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('DELETE /api/assignment/:id', () => {
    let token: string
    let instructorId: string
    let courseId: string
    let moduleId: string
    let lessonId: string
    let assignmentId: string

    beforeEach(async () => {
        const user = await UserTest.create({
            username: "instructor",
            email: "instructor@gmail.com",
            password: "instructor",
            role: "INSTRUCTOR"
        })

        token = user.token!
        instructorId = user.id

        const student = await UserTest.create({
            username: "student",
            email: "student@gmail.com",
            password: "student",
            role: "STUDENT"
        })

        const course = await CourseTest.create(instructorId)
        courseId = course.id

        const module = await ModuleTest.create(courseId)
        moduleId = module.id

        const lesson = await LessonTest.create(moduleId)
        lessonId = lesson.id

        const assignment = await AssignmentTest.create(student.id, lessonId, {
            title: "test",
            description: "test",
            maxScore: 100,
            dueDate: new Date("2025-02-06T00:43:10.160Z")
        })

        assignmentId = assignment.id
    })

    afterEach(async () => {
        await AssignmentTest.delete()
        await LessonTest.delete()
        await ModuleTest.delete()
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able delete assignment', async () => {
        const response = await supertest(app)
            .delete(`/api/assignment/${assignmentId}`)
            .set("Authorization", `Bearer ${token}`)
        
        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data).toBe("OK")
    })

    it('should reject delete assignment if token is invalid', async () => {
        const response = await supertest(app)
            .delete(`/api/assignment/${assignmentId}`)
            .set("Authorization", `Bearer invalid`)
        
        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject delete assignment if assignment not found', async () => {
        const response = await supertest(app)
            .delete(`/api/assignment/invalid`)
            .set("Authorization", `Bearer ${token}`)
        
        logger.debug(response.body)
        expect(response.status).toBe(404)
        expect(response.body.errors).toBeDefined()
    })
})