/**
 * Check the login details
 *
 * @param username
 * @param password
 */
export default (username: string, password: string): Promise<boolean> =>
  new Promise<boolean>(resolve =>
    resolve(username === 'admin' && password === 'password'),
  )
