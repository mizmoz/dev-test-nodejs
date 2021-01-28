
import { FastifyInstance } from "fastify";
import { Controller } from "../../types";
import serialize from "fast-safe-stringify";

const KEY = "country";

// NOTE: most of the validations are not implemented due to time constrainst

export default class Country implements Controller {
  fastify: FastifyInstance

  constructor (fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  create () {
    return 0
  }

  read () {
    return 0
  }

  async update (name: string, body: any) {
    const ret = await this.fastify.redis.get(name);

    if (ret) {
      const country = JSON.parse(ret);

      const newName = body.name || name;
      const population = body.population || 0;

      country.name = newName;

      await this.fastify.redis.zrem(KEY, name);
      await this.fastify.redis.del(name);

      this.fastify.redis.set(newName, serialize(country));
      this.fastify.redis.zadd(KEY, population, newName);
    }

    return !!ret
  }

  async delete (name: string) {
    await this.fastify.redis.zrem(KEY, name);
    await this.fastify.redis.del(name);

    return true
  }

  async search () {
    const list = await this.fastify.redis.zrange(KEY, 0, -1);
    const result = [];

    for (let i = 0; i < list.length; i++) {
      const countryName = list[i];
      const details = await this.fastify.redis.get(countryName);

      result.push(JSON.parse(details));
    }

    return result
  }
}