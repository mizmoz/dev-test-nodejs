// console.log("Hello and good luck!");
import server from "./server";

process.on("unhandledRejection", error => {
  console.log("Unhandled Rejection in Server", error);
  process.exit(1);
});

server.listen("8080", () => console.log(`node test listening at 8080.`));
