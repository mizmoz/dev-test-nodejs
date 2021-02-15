import { Request, Response } from 'express';
const HelloWorld = (req: Request, res: Response): Response<any> => res.send({ message: 'Hello World' });
export {HelloWorld};