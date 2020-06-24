import { Request, Response } from "express";
import HttpStatus from "http-status-codes";
import jwt from "jsonwebtoken";

// could've did this in mongo, but running out of time :|
import authenticate from "./authenticate";

const JWT_SECRET =
  process.env.JWT_SECRET || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    if (!authenticate(username, password)) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: "Invalid password" });
    }

    return res.json({ token: jwt.sign({ username }, JWT_SECRET) });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
}
