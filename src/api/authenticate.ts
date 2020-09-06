/**
 * Check the login details
 *
 * @param username
 * @param password
 */
import * as configs from '../configs';
import { sign } from 'jsonwebtoken';

export async function authenticate(username: string, password: string): Promise<string> {

  const token = sign({ username }, configs.JWT_SECRET as string, { expiresIn: configs.JWT_EXPIRES });

  return token;
}

// export async function

