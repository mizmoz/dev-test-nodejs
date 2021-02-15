import authenticate from "./authenticate";
import { NextFunction, Request, Response } from "express";

const authHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let no_error: boolean = false;
  const { username, password } = req.query;
  if (username && password) {
    no_error = await authenticate(username as string, password as string);
  }

  if (no_error == true) {
    next();
  } else {
    res.send({
      Error: "authHandler",
      Message: "Username/Password Wrong",
    });
  }
};

export { authHandler };
