/**
 * Module Dependencies
 */
import basicAuth from 'express-basic-auth';

export default basicAuth({
  users: { archax: 'p@$$m3plz' }, // TODO: Fetch users from any datasource
});
