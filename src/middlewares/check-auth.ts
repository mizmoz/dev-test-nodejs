import { Request, Response, NextFunction } from 'express';

export default async function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (
    !req.headers.authorization ||
    req.headers.authorization.indexOf('Basic ') === -1
  ) {
    return res.status(401).json({ message: 'Missing authorization header' });
  }

  const base64Credentials = req.headers.authorization.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString(
    'ascii',
  );
  const [username, password] = credentials.split(':');
  if (username !== 'username' || password !== 'password') {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  next();
}
