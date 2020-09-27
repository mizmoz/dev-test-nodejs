import {Express} from "express";
import {Server} from "http";

export default function createServer(app: Express): Server {
  const PORT = 3000;

  const server = app.listen(PORT, () => {
    console.log(`App listening at port ${PORT}`);
  });

  return server;
}
