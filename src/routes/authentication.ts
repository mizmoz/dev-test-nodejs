import express from 'express'
import jwt from 'jsonwebtoken'
import auth from '../api/authenticate'
import * as repository from '../repository/refreshTokenRepository'

const router = express.Router()

// to get another token with out having to login
router.post('/token', async (req, res) => {
    const refreshToken = req.header('auth-token')

    if (refreshToken == null) {
        return res.sendStatus(401)
    }

    try {
        const verified: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!)
        const tokenFromRedis = await repository.findByUsername(verified.username)

        if (!tokenFromRedis) {
            return res.sendStatus(403)
        }
        const user = { username: verified.username }
        const accessToken = generateAccessToken(user)
        res.header("auth-token", accessToken).json({ accessToken })
    } catch (error) {
        return res.sendStatus(403)
    }
})

router.delete('/logout', async (req, res) => {
    const refreshToken = req.header('auth-token')

    if (refreshToken == null) {
        return res.sendStatus(401)
    }

    const verified: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!)

    try {
        const deleted = await repository.remove(verified.username)
    } catch (error) {
        console.warn('Unable to delete refresh token from repo', error)
    }

    res.sendStatus(204)
})

router.post('/login', async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    // Check username and password from api/authenticate
    const authenticated = await auth(username, password)
    if (!authenticated) {
        res.sendStatus(401)
    }

    const user = { username }

    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET!)

    try {
        const added = await repository.save(username, refreshToken)
    } catch (error) {
        console.warn('Unable to add refresh token to repo', error)
    }

    res.header("auth-token", accessToken).json({ accessToken, refreshToken })
})

const generateAccessToken = (user: string | object) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION! })
}

export default router