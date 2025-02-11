import { UserTest, CourseTest, ModuleTest, LessonTest, EnrollmentTest, ProgressTest } from "./test-util"
import { logger } from "../src/app/logging"
import { app } from "../src/app/service"
import supertest from "supertest"

describe('POST /api/courses/:id/progress', () => {
    let studentToken: string
    let studentId: string
    let instructorToken: string
    let instructorId: string
    let courseId: string
    let moduleId: string
    let lessonId: string

    beforeEach(async () => {
        const instructor = await UserTest.create({ 
            username: "instructor",
            email: "instructor@gmail.com",
            password: "instructor",
            role: "INSTRUCTOR"
        })
        
        instructorToken = instructor.token!
        instructorId = instructor.id

        const student = await UserTest.create({ 
            username: "student",
            email: "student@gmail.com",
            password: "student",
            role: "STUDENT"
        })
        
        studentToken = student.token!
        studentId = student.id

        const course = await CourseTest.create(instructorId)
        courseId = course.id

        await EnrollmentTest.create(studentId, courseId)

        const module = await ModuleTest.create(courseId)
        moduleId = module.id

        const lesson = await LessonTest.create(moduleId)
        lessonId = lesson.id
    })

    afterEach(async () => {
        await ProgressTest.delete()
        await LessonTest.delete()
        await ModuleTest.delete()
        await EnrollmentTest.delete()
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able to create progress', async () => {
        const response = await supertest(app)
            .post(`/api/course/${courseId}/progress`)
            .set('Authorization', `Bearer ${studentToken}`)
            .send({
                completedLessons: lessonId,
                progress: 25.0
            })
        
        console.log(response.body)
        logger.debug(response.body)
        expect(response.status).toBe(201)
        expect(response.body.data.progress).toBe(25.0)
        expect(response.body.data.completedLessons).toBe(lessonId)
    })

    it('should reject create progress if course not found', async () => {
        const response = await supertest(app)
            .post(`/api/course/invalid-id/progress`)
            .set('Authorization', `Bearer ${studentToken}`)
            .send({
                completedLessons: lessonId,
                progress: 25.0
            })
        
        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject create progress if data is invalid', async () => {
        const response = await supertest(app)
            .post(`/api/course/${courseId}/progress`)
            .set('Authorization', `Bearer ${studentToken}`)
            .send({
                completedLessons: lessonId,
                progress: -1 
            })

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject if progress already exists', async () => {
        await ProgressTest.create(courseId, studentId, {
            completedLessons: lessonId,
            progress: 25.0
        })

        const response = await supertest(app)
            .post(`/api/course/${courseId}/progress`)
            .set('Authorization', `Bearer ${studentToken}`)
            .send({
                completedLessons: lessonId,
                progress: 30.0
            })

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('GET ALL PROGRESS /api/progress', () => {
    let studentToken: string
    let studentId: string
    let instructorToken: string
    let instructorId: string
    let courseId: string
    let moduleId: string
    let lessonId: string

    beforeEach(async () => {
        const instructor = await UserTest.create({ 
            username: "instructor",
            email: "instructor@gmail.com",
            password: "instructor",
            role: "INSTRUCTOR"
        })

        instructorToken = instructor.token!
        instructorId = instructor.id

        const student = await UserTest.create({ 
            username: "student",
            email: "student@gmail.com",
            password: "student",
            role: "STUDENT"
        })
        
        studentToken = student.token!
        studentId = student.id

        const course = await CourseTest.create(instructorId)
        courseId = course.id

        await EnrollmentTest.create(studentId, courseId)

        const module = await ModuleTest.create(courseId)
        moduleId = module.id

        const lesson = await LessonTest.create(moduleId)
        lessonId = lesson.id

        await ProgressTest.create(courseId, studentId, {
            completedLessons: lessonId,
            progress: 50.0
        })

        await ProgressTest.create(courseId, studentId, {
            completedLessons: lessonId,
            progress: 75.0
        })
    })

    afterEach(async () => {
        await ProgressTest.delete()
        await LessonTest.delete()
        await ModuleTest.delete()
        await EnrollmentTest.delete()
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able to get all progress', async () => {
        const response = await supertest(app)
            .get(`/api/progress`)
            .set('Authorization', `Bearer ${studentToken}`)

        console.log(response.body)
        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.length).toBe(2)
        expect(Array.isArray(response.body.data)).toBe(true)

        const [progress1, progress2] = response.body.data

        expect(progress1.progress).toBe(50.0)
        expect(progress2.progress).toBe(75.0)
    })

    it('should reject get all progress if token is invalid', async () => {
        const response = await supertest(app)
            .get(`/api/progress`)
            .set('Authorization', `Bearer invalid`)

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('GET PROGRESS BY ID /api/progress/:id', () => {
    let studentToken: string
    let studentId: string
    let courseId: string
    let lessonId: string
    let progressId: string

    beforeEach(async () => {
        const instructor = await UserTest.create({ 
            username: "instructor",
            email: "instructor@gmail.com",
            password: "instructor",
            role: "INSTRUCTOR"
        })

        const student = await UserTest.create({ 
            username: "student",
            email: "student@gmail.com",
            password: "student",
            role: "STUDENT"
        })
        
        studentToken = student.token!
        studentId = student.id

        const course = await CourseTest.create(instructor.id)
        courseId = course.id

        const module = await ModuleTest.create(courseId)
        const lesson = await LessonTest.create(module.id)
        lessonId = lesson.id

        const progress = await ProgressTest.create(courseId, studentId, {
            completedLessons: lessonId,
            progress: 60.0
        })

        progressId = progress.id
    })

    afterEach(async () => {
        await ProgressTest.delete()
        await LessonTest.delete()
        await ModuleTest.delete()
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able to get progress by id', async () => {
        const response = await supertest(app)
            .get(`/api/progress/${progressId}`)
            .set('Authorization', `Bearer ${studentToken}`)

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.progress).toBe(60.0)
    })

    it('should reject get progress by id if token is invalid', async () => {
        const response = await supertest(app)
            .get(`/api/progress/${progressId}`)
            .set('Authorization', `Bearer invalid`)

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject get progress by id if progress not found', async () => {
        const response = await supertest(app)
            .get(`/api/progress/invalid-id`)
            .set('Authorization', `Bearer ${studentToken}`)

        logger.debug(response.body)
        expect(response.status).toBe(404)
        expect(response.body.errors).toBeDefined()
    })
})

describe('PATCH PROGRESS BY ID /api/progress/:id', () => {
    let studentToken: string
    let studentId: string
    let courseId: string
    let lessonId: string
    let progressId: string

    beforeEach(async () => {
        const instructor = await UserTest.create({ 
            username: "instructor",
            email: "instructor@gmail.com",
            password: "instructor",
            role: "INSTRUCTOR"
        })

        const student = await UserTest.create({ 
            username: "student",
            email: "student@gmail.com",
            password: "student",
            role: "STUDENT"
        })
        
        studentToken = student.token!
        studentId = student.id

        const course = await CourseTest.create(instructor.id)
        courseId = course.id

        const module = await ModuleTest.create(courseId)
        const lesson = await LessonTest.create(module.id)
        lessonId = lesson.id

        const progress = await ProgressTest.create(courseId, studentId, {
            completedLessons: lessonId,
            progress: 60.0
        })

        progressId = progress.id
    })

    afterEach(async () => {
        await ProgressTest.delete()
        await LessonTest.delete()
        await ModuleTest.delete()
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able to update progress by id', async () => {
        const response = await supertest(app)
            .patch(`/api/progress/${progressId}`)
            .set('Authorization', `Bearer ${studentToken}`)
            .send({ progress: 80.0 })

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.progress).toBe(80.0)
    })

    it('should reject update progress by id if token is invalid', async () => {
        const response = await supertest(app)
            .patch(`/api/progress/${progressId}`)
            .set('Authorization', `Bearer invalid`)
            .send({ progress: 80.0 })

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject update progress by id if progress not found', async () => {
        const response = await supertest(app)
            .patch(`/api/progress/invalid-id`)  
            .set('Authorization', `Bearer ${studentToken}`)
            .send({ progress: 80.0 })
        
        logger.debug(response.body)
        expect(response.status).toBe(404)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject update progress by id if data is invalid', async () => {
        const response = await supertest(app)
            .patch(`/api/progress/${progressId}`)
            .set('Authorization', `Bearer ${studentToken}`)
            .send({ progress: -1 })

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('DELETE PROGRESS BY ID /api/progress/:id', () => {
    let studentToken: string
    let studentId: string
    let courseId: string
    let lessonId: string
    let progressId: string

    beforeEach(async () => {
        const instructor = await UserTest.create({ 
            username: "instructor",
            email: "instructor@gmail.com",
            password: "instructor",
            role: "INSTRUCTOR"
        })

        const student = await UserTest.create({ 
            username: "student",
            email: "student@gmail.com",
            password: "student",
            role: "STUDENT"
        })
        
        studentToken = student.token!
        studentId = student.id

        const course = await CourseTest.create(instructor.id)
        courseId = course.id

        const module = await ModuleTest.create(courseId)
        const lesson = await LessonTest.create(module.id)
        lessonId = lesson.id

        const progress = await ProgressTest.create(courseId, studentId, {
            completedLessons: lessonId,
            progress: 60.0
        })

        progressId = progress.id
    })

    afterEach(async () => {
        await ProgressTest.delete()
        await LessonTest.delete()
        await ModuleTest.delete()
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able to delete progress by id', async () => {
        const response = await supertest(app)
            .delete(`/api/progress/${progressId}`)
            .set('Authorization', `Bearer ${studentToken}`)

        logger.debug(response.body)
        expect(response.status).toBe(200)
    })

    it('should reject delete progress by id if token is invalid', async () => {
        const response = await supertest(app)
            .delete(`/api/progress/${progressId}`)
            .set('Authorization', `Bearer invalid`)
        
        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject delete progress by id if progress not found', async () => {
        const response = await supertest(app)
            .delete(`/api/progress/invalid-id`)
            .set('Authorization', `Bearer ${studentToken}`)
        
        logger.debug(response.body)
        expect(response.status).toBe(404)
        expect(response.body.errors).toBeDefined()
    })
})