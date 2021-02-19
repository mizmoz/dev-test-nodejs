import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export default (req: any, res: Response, next: NextFunction) => {
    const token = req.header('auth-token')

    if (!token) {
        return res.sendStatus(401)
    }

    try {
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!)
        req.user = verified
        next()
    } catch (error) {
        res.sendStatus(403)
    }
}