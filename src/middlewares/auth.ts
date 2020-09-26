import { Request, Response, NextFunction } from 'express';
import authAPI from '../api/authenticate';

export const basicAuth = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (username && password) {
        const authenticated = await authAPI(username, password);
        if (!authenticated) {
            res.status(401)
                .json({
                    error: 'Not Authorized',
                    message: 'Invalid credentials'
                });
        }
    }
    next();
}

