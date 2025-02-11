import { AssignmentTest, UserTest, SubmissionTest, LessonTest, CourseTest, ModuleTest, EnrollmentTest } from "./test-util"
import { logger } from "../src/app/logging"
import { app } from "../src/app/service"
import supertest from "supertest"

describe('POST /api/assignment/:id/submission', () => {
    let studentToken: string
    let studentId: string
    let instructorToken: string
    let instructorId: string
    let courseId: string
    let moduleId: string
    let lessonId: string
    let assignmentId: string

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

        const assignment = await AssignmentTest.create(instructorId, lessonId, {
            title: "test",
            description: "test",
            maxScore: 100,
            dueDate: new Date("2025-02-06T00:43:10.160Z")
        })

        assignmentId = assignment.id
    })

    afterEach(async () => {
        // Cleanup in reverse order
        await SubmissionTest.delete()
        await AssignmentTest.delete()
        await LessonTest.delete()
        await ModuleTest.delete()
        await EnrollmentTest.delete()  
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able create submission', async () => {
        const response = await supertest(app)
            .post(`/api/assignment/${assignmentId}/submission`)
            .set('Authorization', `Bearer ${studentToken}`)
            .send({
                content: "test"
            })
        
        console.log(response.body)
        logger.debug(response.body)
        expect(response.status).toBe(201)
        expect(response.body.data.content).toBe("test")
    })

    it('should reject create submission if token is invalid', async () => {
        const response = await supertest(app)
            .post(`/api/assignment/${assignmentId}/submission`)
            .set('Authorization', `Bearer invalid`)
            .send({
                content: "test"
            })

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject create submission if assignment not found', async () => {
        const response = await supertest(app)
            .post(`/api/assignment/invalid/submission`)
            .set('Authorization', `Bearer ${studentToken}`)
            .send({
                content: "test"
            })
        
        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject create submission if data is invalid', async () => {
        const response = await supertest(app)
            .post(`/api/assignment/${assignmentId}/submission`)
            .set('Authorization', `Bearer ${studentToken}`)
            .send({
                content: ""
            })

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('GET ALL SUBMISSION /api/submissions', () => {
    let studentToken: string
    let studentId: string
    let instructorToken: string
    let instructorId: string
    let courseId: string
    let moduleId: string
    let lessonId: string
    let assignmentId: string

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

        const assignment = await AssignmentTest.create(instructorId, lessonId, {
            title: "test",
            description: "test",
            maxScore: 100,
            dueDate: new Date("2025-02-06T00:43:10.160Z")
        })

        assignmentId = assignment.id

        await SubmissionTest.create(assignmentId, studentId, {
            content: "test"
        })

        await SubmissionTest.create(assignmentId, studentId, {
            content: "coba"
        })
    })

    afterEach(async () => {
        await SubmissionTest.delete()
        await AssignmentTest.delete()
        await LessonTest.delete()
        await ModuleTest.delete()
        await EnrollmentTest.delete()  
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able get all submission', async () => {
        const response = await supertest(app)
            .get(`/api/submissions`)
            .set('Authorization', `Bearer ${studentToken}`)

        console.log(response.body)
        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.length).toBe(2)
        expect(Array.isArray(response.body.data)).toBe(true)

        const [submission1, submission2] = response.body.data

        expect(submission1.content).toBe("test")
        expect(submission2.content).toBe("coba")
    })

    it('should reject get all submission if token is invalid', async () => {
        const response = await supertest(app)
            .get(`/api/submissions`)
            .set('Authorization', `Bearer invalid`)

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('GET SUBMISSION /api/submission/:id', () => {
    let studentToken: string
    let studentId: string
    let instructorToken: string
    let instructorId: string
    let courseId: string
    let moduleId: string
    let lessonId: string
    let assignmentId: string
    let submissionId: string

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

        const assignment = await AssignmentTest.create(instructorId, lessonId, {
            title: "test",
            description: "test",
            maxScore: 100,
            dueDate: new Date("2025-02-06T00:43:10.160Z")
        })

        assignmentId = assignment.id

        const submission = await SubmissionTest.create(assignmentId, studentId, {
            content: "test"
        })

        submissionId = submission.id
    })

    afterEach(async () => {
        await SubmissionTest.delete()
        await AssignmentTest.delete()
        await LessonTest.delete()
        await ModuleTest.delete()
        await EnrollmentTest.delete()  
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able get submission', async () => {
        const response = await supertest(app)
            .get(`/api/submission/${submissionId}`)
            .set('Authorization', `Bearer ${studentToken}`)

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.content).toBe("test")
    })

    it('should reject get submission if token is invalid', async () => {
        const response = await supertest(app)
            .get(`/api/submission/${submissionId}`)
            .set('Authorization', `Bearer invalid`)

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject get submission if submission not found', async () => {
        const response = await supertest(app)
            .get(`/api/submission/invalid`)
            .set('Authorization', `Bearer ${studentToken}`)

        logger.debug(response.body)
        expect(response.status).toBe(404)
        expect(response.body.errors).toBeDefined()
    })
})

describe('UPDATE /api/submission/:id', () => {
    let studentToken: string
    let studentId: string
    let instructorToken: string
    let instructorId: string
    let courseId: string
    let moduleId: string
    let lessonId: string
    let assignmentId: string
    let submissionId: string

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

        const assignment = await AssignmentTest.create(instructorId, lessonId, {
            title: "test",
            description: "test",
            maxScore: 100,
            dueDate: new Date("2025-02-06T00:43:10.160Z")
        })

        assignmentId = assignment.id

        const submission = await SubmissionTest.create(assignmentId, studentId, {
            content: "test"
        })

        submissionId = submission.id
    })

    afterEach(async () => {
        await SubmissionTest.delete()
        await AssignmentTest.delete()
        await LessonTest.delete()
        await ModuleTest.delete()
        await EnrollmentTest.delete()  
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able update submission', async () => {
        const response = await supertest(app)
            .patch(`/api/submission/${submissionId}`)
            .set('Authorization', `Bearer ${instructorToken}`)
            .send({
                grade: 100
            })

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.grade).toBe(100)
    })

    it('should reject update submission if token is invalid', async () => {
        const response = await supertest(app)
            .patch(`/api/submission/${submissionId}`)
            .set('Authorization', `Bearer invalid`)

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject update submission if submission not found', async () => {
        const response = await supertest(app)
            .patch(`/api/submission/invalid`)
            .set('Authorization', `Bearer ${instructorToken}`)

        logger.debug(response.body)
        expect(response.status).toBe(404)
        expect(response.body.errors).toBeDefined()
    })
})

describe('DELETE /api/submission/:id', () => {
    let studentToken: string
    let studentId: string
    let adminToken: string
    let adminId: string
    let courseId: string
    let moduleId: string
    let lessonId: string
    let assignmentId: string
    let submissionId: string

    beforeEach(async () => {
        const admin = await UserTest.create({ 
            username: "admin",
            email: "admin@gmail.com",
            password: "admin",
            role: "ADMIN"
        })

        adminToken = admin.token!
        adminId = admin.id

        const student = await UserTest.create({ 
            username: "student",
            email: "student@gmail.com",
            password: "student",
            role: "STUDENT"
        })
        
        studentToken = student.token!
        studentId = student.id

        const course = await CourseTest.create(adminId)
        courseId = course.id

        await EnrollmentTest.create(studentId, courseId)

        const module = await ModuleTest.create(courseId)
        moduleId = module.id

        const lesson = await LessonTest.create(moduleId)
        lessonId = lesson.id

        const assignment = await AssignmentTest.create(adminId, lessonId, {
            title: "test",
            description: "test",
            maxScore: 100,
            dueDate: new Date("2025-02-06T00:43:10.160Z")
        })

        assignmentId = assignment.id

        const submission = await SubmissionTest.create(assignmentId, studentId, {
            content: "test"
        })

        submissionId = submission.id
    })

    afterEach(async () => {
        await SubmissionTest.delete()
        await AssignmentTest.delete()
        await LessonTest.delete()
        await ModuleTest.delete()
        await EnrollmentTest.delete()  
        await CourseTest.delete()
        await UserTest.delete()
    })

    it('should be able delete submission', async () => {
        const response = await supertest(app)
            .delete(`/api/submission/${submissionId}`)
            .set("Authorization", `Bearer ${adminToken}`)

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data).toBe("OK")
    })

    it('should reject delete submission if token is invalid', async () => {
        const response = await supertest(app)
            .delete(`/api/submission/${submissionId}`)
            .set("Authorization", `Bearer invalid`)

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject delete submission if submission not found', async () => {
        const response = await supertest(app)
            .delete(`/api/submission/invalid`)
            .set("Authorization", `Bearer ${adminToken}`)

        logger.debug(response.body)
        expect(response.status).toBe(404)
        expect(response.body.errors).toBeDefined()
    })
})
