/**
 * Check the login details
 *
 * @param username
 * @param password
 */
import * as configs from '../configs';
import { sign, verify } from 'jsonwebtoken';
import { get } from './redis-client';
import { createHmac } from 'crypto';
import { User } from '../types';


export async function authenticate(username: string, password: string): Promise<string | null> {


  const hash = createHmac('sha256', configs.SHA_SECRET as string)
    .update(password)
    .digest('base64');

  const data = await get(`user:${username}`);

  if (!data) {
    return null;
  }

  const user = JSON.parse(data) as User;

  if (user.password !== hash) {
    return null;
  }


  return sign({ username }, configs.JWT_SECRET as string, { expiresIn: configs.JWT_EXPIRES });

}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    verify(token, configs.JWT_SECRET as string);
    return true;
  } catch(err) {
    return false;
  }
}

// export async function

