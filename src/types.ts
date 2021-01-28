import { FastifyInstance } from "fastify";

export interface Country {
  name: string;
  code: string;
}

export interface Controller {
  readonly fastify: FastifyInstance;
  
  create: () => number
  read: (name: string) => number
  update: (name: string, body: any) => Promise<boolean>
  delete: (name: string) => Promise<boolean>
  search: () => Promise<Array<any>>
}