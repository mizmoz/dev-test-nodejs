import main from "./main";

const app: any = {};

function gracefulExit(): void {
  const { httpServer } = app;

  if (httpServer) httpServer.close();

  process.exit(0);
}

const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];

signals.forEach((signal) => {
  process.on(signal, gracefulExit);
});

main()
  .then((obj: any) => {
    Object.assign(app, obj);
  })
  .catch((err: Error) => {
    throw err;
  });
