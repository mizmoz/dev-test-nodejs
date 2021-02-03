/**
 * Module Dependencies
 */
import { Map } from 'immutable';

import packageJson from '../package.json';

const fromJS = <O>(obj: O): IM<O> => Map(obj as any) as any;

export default fromJS({
  PROJECT_NAME: packageJson.name,

  HTTP_PORT: parseInt(process.env.HTTP_PORT || '8081', 10),

  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
});

interface IM<O> extends Map<O, any> {
  get<K extends keyof O>(key: K): O[K];
}
