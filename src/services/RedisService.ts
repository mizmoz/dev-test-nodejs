import { Service } from "typedi";
import { RedisClient } from "redis";

@Service()
export class RedisService {
  private privateClient: RedisClient;

  constructor(client: RedisClient) {
    this.privateClient = client;
  }

  get client() {
    return this.privateClient;
  }
}
