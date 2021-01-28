import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import auth from "./authenticate"

export default async function router(fastify: FastifyInstance) {

  fastify.post("/auth", async function (request: FastifyRequest, reply: FastifyReply) {
    // @ts-ignore
    const { username, password } = request.body; 

    try {
      const accessToken = await auth(username, password);

      // TOCHECKER: im expecting auth() will return a JWT token and will be handeld by fastify preValidation on each request

      reply
        .code(200)
        .send({ token: accessToken });

    } catch (error) {
      console.log(error); // TODO: to err logging service

      reply
        .code(500)
        .send({ message: 'Internal server error occured.' });
    }
  });
}
