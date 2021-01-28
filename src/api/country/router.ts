import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

import Controller from "./controller";

export default async function router(fastify: FastifyInstance) {
  const ctl = new Controller(fastify);

  fastify.get("/country", async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      const countries = await ctl.search();

      reply
        .code(200)
        .send(countries);

    } catch (error) {
      console.log(error); // TODO: to err logging service

      reply
        .code(500)
        .send({ message: 'Internal server error occured.' });
    }
  });

  fastify.patch("/country/:name", async function (request: FastifyRequest, reply: FastifyReply) {
    const { params, body } = request
    // @ts-ignore
    const { name } = params; 

    try {
      const ret = await ctl.update(name, body);

      reply
        .code(200)
        .send({ result: ret });

    } catch (error) {
      console.log(error); // TODO: to err logging service

      reply
        .code(500)
        .send({ message: 'Internal server error occured.' });
    }
  });

  fastify.delete("/country/:name", async function (request: FastifyRequest, reply: FastifyReply) {
    // @ts-ignore
    const { name } = request.params; 

    const ret = await ctl.delete(name);

    reply
      .code(200)
      .send({ result: ret });
  });
}
