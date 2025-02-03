import { ZodError } from "zod"
import { ResponseError } from "../util/error/error"
import { Request, Response, NextFunction } from "express"

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ZodError) {
        res.status(400).json({
            errors: `Validation error ${JSON.stringify(err)}`
        })
    }else if (err instanceof ResponseError) {
        res.status(err.status).json({
            errors: err.message
        })
    }else {
        res.status(500).json({
            errors: err.message
        })
    }
}