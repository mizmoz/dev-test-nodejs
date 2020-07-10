import * as redis from '../entities/redis';
import { Authentication } from '../types';

/**
 * Check the login details
 *
 * @param username
 * @param password
 */
export default async (username: string, password: string): Promise<boolean> => {
  const credentials = await redis.get<Authentication>('authentication') || {} as Authentication;

  return credentials.username === username && credentials.password === password;
};
