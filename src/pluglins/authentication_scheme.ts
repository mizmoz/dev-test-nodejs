import { Request, ResponseToolkit } from "@hapi/hapi";
import redis from '../lib/redis';

const Scheme = () => {
  return {
    authenticate: async (request: Request, h: ResponseToolkit) => {
      const token = request.headers.authorization;

      if (!token) return h.unauthenticated(new Error('Authorization header missing'));

      // check the scheme type
      const tokenExist = await redis.get(token)

      if (!tokenExist) return h.unauthenticated(new Error('Unknown session'))

      return h.authenticated({ credentials: { scope: ['all'] } })
    }
  }
}

export default Scheme
