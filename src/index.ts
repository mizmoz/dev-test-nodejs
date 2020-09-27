import createApp from "./app";
import createServer from "./server";

const app = createApp();

createServer(app);
