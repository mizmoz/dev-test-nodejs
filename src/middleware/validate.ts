import express from 'express';
import authenticate from '../api/authenticate'


export default async function (req: express.Request, res: express.Response, next: express.NextFunction) {


    const { username = null, password = null } = await req.body //req.headers

    const isValid = await authenticate(username, password)

    if (!isValid) {
        return res.status(403).json({ error: 'Username and Password are required' });
    }

    next();
}