require('dotenv-safe').config()

import { Server } from "@hapi/hapi";
import loadPlugins from './pluglins';
const { API_PORT, API_HOST } = process.env;

const init = async () => {
  const server: Server = new Server({
    host: API_HOST || '127.0.0.1',
    port: API_PORT || 3000,
  });

  await loadPlugins(server);
  await server.start();

  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();