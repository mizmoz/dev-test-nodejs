import { Request, Response, NextFunction } from "express";
import authenticate from "../api/authenticate";

export default (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) res.status(401).send("User not authenticated.");
  else {
    const auth = Buffer.from(authHeader.split(" ")[1], "base64")
      .toString()
      .split(":");

    authenticate(auth[0], auth[1]).then((result) => {
      result ? next() : res.status(401).send("Invalid user credentials.");
    });
  }
};
