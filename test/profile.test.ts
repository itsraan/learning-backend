import { ProfileTest, UserTest } from "./test-util"
import { logger } from "../src/app/logging"
import { app } from "../src/app/service"
import supertest from "supertest"

describe('POST /api/profile', () => {
    let token: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
    })

    afterEach(async () => {
        await ProfileTest.delete()
        await UserTest.delete()
    })

    it('should create new profile', async () => {
        const response = await supertest(app)
            .post("/api/profile")
            .set("Authorization", `Bearer ${token}`) 
            .send({
                firstName: "test",
                lastName: "test",
                bio: "test",
                dateOfBirth: "2025-01-01",
                location: "sungki"
            })

        logger.debug(response.body)
        expect(response.status).toBe(201)
        expect(response.body.data.firstName).toBe("test")
        expect(response.body.data.lastName).toBe("test")
        expect(response.body.data.bio).toBe("test")
        expect(response.body.data.dateOfBirth).toBe("2025-01-01T00:00:00.000Z")
    })

    it('should reject create new profile if data is invalid', async () => {
        const response = await supertest(app)
            .post("/api/profile")
            .set("Authorization", `Bearer ${token}`) 
            .send({
                firstName: "",
                lastName: "",
                bio: "",
                dateOfBirth: "",
                location: ""
            })

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('GET /api/address/:id', () => {
    let token: string
    let userId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        userId = user.id
        await ProfileTest.create(userId)
    })

    afterEach(async () => {
        await ProfileTest.delete()
        await UserTest.delete()
    })

    it('should be able to get profile', async () => {
        const profile = await ProfileTest.get(userId)
        const response = await supertest(app)
            .get(`/api/profile/${profile.id}`)
            .set("Authorization", `Bearer ${token}`)

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.firstName).toBe(profile.firstName)
        expect(response.body.data.lastName).toBe(profile.lastName)
        expect(response.body.data.bio).toBe(profile.bio)
        expect(response.body.data.location).toBe(profile.location)
    })

    it('should reject get profile if profile is not found', async () => {
        const profile = await ProfileTest.get(userId)
        const response = await supertest(app)
            .get(`/api/profile/${"non-existing-id"}`)
            .set("Authorization", `Bearer ${token}`)

        logger.debug(response.body)
        expect(response.status).toBe(404)
        expect(response.body.errors).toBeDefined()
    })
})

describe('PATCH /api/profile/:id', () => {
    let token: string
    let userId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        userId = user.id
        await ProfileTest.create(userId)
    })

    afterEach(async () => {
        await ProfileTest.delete()
        await UserTest.delete()
    })

    it('should be able to update profile', async () => {
        const profile = await ProfileTest.get(userId)
        const response = await supertest(app)
            .patch(`/api/profile/${profile.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                firstName: "update",
                lastName: "update",
                bio: "update",
                dateOfBirth: "2025-01-01",
                location: "sungki"
            })

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.firstName).toBe("update")
        expect(response.body.data.lastName).toBe("update")
        expect(response.body.data.bio).toBe("update")
        expect(response.body.data.location).toBe("sungki")
    })

    it('should reject update profile if request is invalid', async () => {
        const profile = await ProfileTest.get(userId)
        const response = await supertest(app)
            .patch(`/api/profile/${profile.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                firstName: "",
                lastName: "",
                bio: "",
                dateOfBirth: "2025-01-01",
                location: ""
            })

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('DELETE /api/profile/:id', () => {
    let token: string
    let userId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        userId = user.id
        await ProfileTest.create(userId)
    })

    afterEach(async () => {
        await ProfileTest.delete()
        await UserTest.delete()
    })

    it('should be able to remove profile', async () => {
        const profile = await ProfileTest.get(userId)
        const response = await supertest(app)
            .delete(`/api/profile/${profile.id}`)
            .set("Authorization", `Bearer ${token}`)

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data).toBe("OK")
    })

    it('should reject remove profile if address is not found', async () => {
        const profile = await ProfileTest.get(userId)
        const response = await supertest(app)
            .delete(`/api/profile/${profile.id+1}`)
            .set("Authorization", `Bearer ${token}`)

        logger.debug(response.body)
        expect(response.status).toBe(404)
        expect(response.body.errors).toBeDefined()
    })
})