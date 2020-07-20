import { Request, Response } from "express";
import { getRepository } from "typeorm";

import { User } from "../database/entity/User";
import { generateToken } from "../shared/utils";

export class Auth {
  static login = async (req: Request, res: Response) => {
    // check if username and password are set
    const { username, password } = req.body;
    if (!(username && password)) {
      res.status(400).send({ message: "Fill in required fields: username and password" });
      return;
    }

    // get user from database
    const userRepository = getRepository(User);
    let user: User;

    try {
      user = await userRepository.findOneOrFail({ where: { username } });

      // check if encrypted password match
      if (!user.checkIfUnencryptedPasswordIsValid(password)) {
        res.status(401).json({ error: { name: "PasswordIncorrect", message: "Incorrect password" } });
        return;
      }

      // generate token that is valid for 1 hour
      const token = generateToken(
        { userId: user.id, username: user.username },
      );

      // send the jwt in the response
      res.send({ token, username: user.username });

    } catch (error) {
      res.status(401).send({ error: {...error, message: "No account is associated with that username" } });
    }
  };
}
