import { RequestHandler } from 'express';

import * as Redis from '../redis';
import { User } from '../types';
import { Bcrypt, Context, Errors, JWT } from '../utils';

/**
 * Check the login details
 *
 * @param username
 * @param password
 */
const authenticate = async (username: string, password: string): Promise<boolean> => {
  try {
    const userString = await Redis.get(`user:${username}`);
    if (!userString) {
      return false;
    }

    const user: User = JSON.parse(userString);
    if (user) {
      return await Bcrypt.compare(password, user.password);
    }

    return false;
  } catch (error) {
    throw new Errors.BadRequestError(error.message);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  const { body: { username, password } } = req;
  try {
    const isCredentialsValid = await authenticate(username, password);
    if (!isCredentialsValid) {
      throw new Errors.BadRequestError('User does not exist.');
    }
    const token = await JWT.sign(username);

    return res.status(200).json({ token });
  } catch (error) {
    return next(error);
  }
};

export const me: RequestHandler = async (req, res, next) => {
  const ctx: Context = Context.get(req) || { username: '' };

  try {
    const userString = await Redis.get(`user:${ctx.username}`);
    if (!userString) {
      throw new Errors.BadRequestError('User does not exist.');
    }

    const user: User = JSON.parse(userString);
    return res.status(200).json({ user });
  } catch (error) {
    return next(error);
  }
};

export const register: RequestHandler = async (req, res, next) => {
  const { body: { username, password } } = req;

  try {
    const userString = await Redis.get(`user:${username}`);
    if (userString) {
      throw new Errors.BadRequestError('User is already existing.');
    }

    const user: User = { username, password: await Bcrypt.hash(password) };

    await Redis.set(`user:${username}`, JSON.stringify(user));
    
    const token = await JWT.sign(user.username); 

    return res.status(200).json({ token });
  } catch (error) {
    return next(error);
  }
};
