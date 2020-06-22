require('dotenv-safe').config()

import { Server } from "@hapi/hapi";
import loadPlugins from './pluglins';

const init = async () => {
  const server: Server = new Server({
    port: 3000,
    host: 'localhost'
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