import supertest from "supertest"
import { app } from "../src/app/service"
import { UserTest } from "./test-util"
import { logger } from "../src/app/logging"
import bcrypt from "bcrypt"

describe('POST /api/register', () => {
    afterEach(async () => {
        await UserTest.delete()
    })

    it('should be able register new user', async () => {
        const response = await supertest(app)
            .post("/api/register")
            .send({
                username: "test",
                email: "test@gmail.com",
                password: "test",
                role: "INSTRUCTOR"
            })

        logger.debug(response.body)
        expect(response.status).toBe(201)
        expect(response.body.data.username).toBe("test")
        expect(response.body.data.email).toBe("test@gmail.com")
        expect(response.body.data.role).toBe("INSTRUCTOR")
    })

    it('should reject register user if data is invalid', async () => {
        const response = await supertest(app)
            .post("/api/register")
            .send({
                username: "",
                email: "",
                password: ""
            })

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('GET /api/users', () => {
    let token: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
    })

    afterEach(async () => {
        await UserTest.delete()
    })

    it('should be able to get user', async () => {
        const response = await supertest(app)
            .get("/api/users")
            .set("Authorization", `Bearer ${token}`)

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.username).toBe("test")
        expect(response.body.data.email).toBe("test@gmail.com")
        expect(response.body.data.role).toBe("INSTRUCTOR")
    })

    it('should reject get user if token is invalid', async () => {
        const response = await supertest(app)
            .get("/api/users")
            .set("Authorization", `Bearer error`)

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject get user if token is missing', async () => {
        const response = await supertest(app)
            .get("/api/users")

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('PATCH /api/users', () => {
    let token: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
    })

    afterEach(async () => {
        await UserTest.delete()
    })

    it('should be able to update user', async () => {
        const response = await supertest(app)
            .patch("/api/users")
            .set("Authorization", `Bearer ${token}`)
            .send({
                username: "update",
                password: "update"
            })

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.username).toBe("update")

        const user = await UserTest.get()
        expect(await bcrypt.compare("update", user.password)).toBe(true)
    })

    it('should reject update user if data is invalid', async () => {
        const response = await supertest(app)
            .patch("/api/users")
            .set("Authorization", `Bearer ${token}`)
            .send({
                username: "t",
                password: "tt"
            })

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject update user if token is invalid', async () => {
        const response = await supertest(app)
            .patch("/api/users")
            .set("Authorization", `Bearer salah`)
            .send({
                username: "test",
                password: "test"
            })

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('POST /api/login', () => {
    beforeEach(async () => {
        await UserTest.create()
    })

    afterEach(async () => {
        await UserTest.delete()
    })

    it('should be able to login', async () => {
        const response = await supertest(app)
            .post("/api/login")
            .send({
                email: "test@gmail.com",
                password: "test"
            })

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.username).toBe("test")
        expect(response.body.data.email).toBe("test@gmail.com")
        expect(response.body.data.token).toBeDefined()
    })

    it('should reject login if Email is invalid', async () => {
        const response = await supertest(app)
            .post("/api/login")
            .send({
                email: "exampli@gmail.com",
                password: "Test@2003"
            })

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject login if Password is invalid', async () => {
        const response = await supertest(app)
            .post("/api/login")
            .send({
                email: "test@gmail.com",
                password: "exampe"
            })

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('DELETE /api/users', () => {
    let token: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
    })

    afterEach(async () => {
        await UserTest.delete()
    })

    it('should be able to logout', async () => {
        const response = await supertest(app)
            .delete("/api/users")
            .set("Authorization", `Bearer ${token}`)

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data).toBe("OK")

        const user = await UserTest.get()
        expect(user.token).toBeNull() 
    })

    it('should reject logout if token is invalid', async () => {
        const response = await supertest(app)
            .delete("/api/users")
            .set("Authorization", `Bearer salah`)

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})