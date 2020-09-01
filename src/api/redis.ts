import redis from "redis";
import { promisify } from "util";

export default class RedisClient {
  private client: any;
  private _get: any;
  private _set: any;
  private _del: any;

  constructor() {
    this.client = redis.createClient("redis://localhost:6379");

    this._get = promisify(this.client.get).bind(this.client);
    this._set = promisify(this.client.set).bind(this.client);
    this._del = promisify(this.client.del).bind(this.client);
  }

  /**
   * set
   */
  public async set(key: string, value: string) {
    await this._set(key, value);
  }

  /**
   * get
   */
  public async get(key: string) {
    return await this._get(key);
  }

  /**
   * async delete
   */
  public async delete(key: string) {
    await this._del(key);
  }
}
