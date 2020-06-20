import redis from '../configs/redis';

/**
 * Check the login details
 *
 * @param username
 * @param password
 */
export default (username: string, password: string): Promise<boolean> =>
  new Promise<boolean>(resolve =>
    redis.get(username, (err, reply) => {
      if (err) return resolve(false);

      return resolve(password == reply);
    })
  );
