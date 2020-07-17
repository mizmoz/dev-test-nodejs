import app from "./app";
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Country API server listening on port " + port);
});