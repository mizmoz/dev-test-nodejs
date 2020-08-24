/**
 * Check the login details
 *
 * @param username
 * @param password
 */
export default (username: string, password: string): Promise<boolean> =>
  new Promise<boolean>(resolve =>
    // tslint:disable-next-line:tsr-detect-possible-timing-attacks
    resolve(username === 'username' && password === 'password'),
  )
