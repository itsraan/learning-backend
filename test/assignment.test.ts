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
        const response = await supertest(app)
            .post(`/api/lesson/${lessonId}/assignment`)
            .set("Authorization", `Bearer ${token}`)
            .send({  
                title: "test", 
                description: "test", 
                maxScore: 100, 
                dueDate: new Date() 
            })

        console.log(response.body)
        logger.debug(response.body)
        expect(response.status).toBe(201)
        expect(response.body.data.title).toBe("test")
        expect(response.body.data.description).toBe("test")
        expect(response.body.data.maxScore).toBe(100)
        expect(response.body.data.dueDate).toBe(new Date())
    })
})