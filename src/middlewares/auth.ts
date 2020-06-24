import jwt from "express-jwt";

export default jwt({
  secret: process.env.APP_SECRET || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
});
