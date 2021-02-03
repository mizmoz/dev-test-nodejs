import fs from "fs";
import { Container } from "typedi";
import { BadRequestError, Action } from "routing-controllers";

import { AuthService } from "./services/AuthService";

export const checkJwtKeys = () => {
  const privateKeyPath = process.env.JWT_PRIVATE_KEY_PATH;
  const publicKeyPath = process.env.JWT_PUBLIC_KEY_PATH;

  let jwtPrivateKeyExists = false;

  try {
    jwtPrivateKeyExists = Boolean(
      privateKeyPath &&
        fs.existsSync(privateKeyPath) &&
        !fs.lstatSync(privateKeyPath).isDirectory(),
    );
  } catch (e) {
    console.error(e);
    throw new Error(
      "Could not read JWT private key file. Please set the environment variable JWT_PRIVATE_KEY_PATH to an RS256 private key file.",
    );
  }

  if (!jwtPrivateKeyExists) {
    throw new Error(
      "JWT private key file does not exist. Please set the environment variable JWT_PRIVATE_KEY_PATH to an RS256 private key file.",
    );
  }

  let jwtPublicKeyExists = false;

  try {
    jwtPublicKeyExists = Boolean(
      publicKeyPath &&
        fs.existsSync(publicKeyPath) &&
        !fs.lstatSync(publicKeyPath).isDirectory(),
    );
  } catch (e) {
    console.error(e);
    throw new Error(
      "Could not read JWT public key file. Please set the environment variable JWT_PUBLIC_KEY_PATH to an RS256 public key file.",
    );
  }

  if (!jwtPublicKeyExists) {
    throw new Error(
      "JWT public key file does not exist. Please set the environment variable JWT_PUBLIC_KEY_PATH to an RS256 public key file.",
    );
  }
};

export const authorizationChecker = async (action: Action) => {
  const auth = Container.get(AuthService);
  const authHeader = action.request.headers["authorization"];

  if (!authHeader) {
    throw new BadRequestError("Missing Authorization header.");
  }

  const [authType, token] = authHeader?.split(" ");

  if (authType !== "Bearer") {
    throw new BadRequestError(
      'App only supports Bearer authorization. Please make sure Authorization header is in the format "Bearer {token}"',
    );
  }

  try {
    const decoded = await auth.verifyToken<{ username: string }>(token);

    if (decoded.username) {
      return true;
    }
    return false;
  } catch (e) {
    console.error(e);
    return false;
  }
};
