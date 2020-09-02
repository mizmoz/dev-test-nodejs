import { Request, Response } from 'express'
import authenticate from '../api/authenticate';

const redisClient = require('../storage/redis');

/**
 * @api {POST} /api/auth/login User Login
 * @apiDescription This api will authenticate the user
 * @apiExample {js} Example usage:
 *     /api/auth/login
 *
 * @apiBody {String} username
 * @apiBody {String} password
 *
 */
export const login = async (req: Request, res: Response) => {
  try {

    const { username, password } = req.body;

    if (!username) return res.status(400).json({ message: `username is required`, success: false});
    if (!password) return res.status(400).json({ message: `password is required`, success: false});

    const isAuthorizedUser = await authenticate(username, password)
    if (!isAuthorizedUser) {
      await redisClient.set('isAuthorized', 'false');

      return res
        .status(401)
        .json({ message: 'Invalid Authentication Credentials', success: false })
    }

    await redisClient.set('isAuthorized', 'true');

    return res.status(200).send({
      message: 'Successful Authentication',
      success: true,
    })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}
