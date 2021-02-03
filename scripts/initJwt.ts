import process from "process";
import dotenv from "dotenv";
import fs from "fs";

import { createPrivateKey, createPublicKey } from "./keyFileGenerators";

dotenv.config();

if (!(process.env.DEV_INIT_JWT === "true")) {
  process.exit(0);
}

if (typeof process.env.JWT_PRIVATE_KEY_PATH === "undefined") {
  throw new Error("JWT_PRIVATE_KEY_PATH env var not undefined.");
}

if (typeof process.env.JWT_PUBLIC_KEY_PATH === "undefined") {
  throw new Error("JWT_PRIVATE_KEY_PATH env var not undefined.");
}

const privateKeyPath = process.env.JWT_PRIVATE_KEY_PATH;
const privateKeyExists = fs.existsSync(privateKeyPath);
const privateKeyPathIsDir = fs.lstatSync(privateKeyPath).isDirectory();
const privateKeyPathIsValid = privateKeyExists && !privateKeyPathIsDir;

const publicKeyPath = process.env.JWT_PUBLIC_KEY_PATH;
const publicKeyExists = fs.existsSync(publicKeyPath);
const publicKeyPathIsDir = fs.lstatSync(publicKeyPath).isDirectory();
const publicKeyPathIsValid = publicKeyExists && !publicKeyPathIsDir;

if (!privateKeyPathIsValid) {
  console.log("JWT key file does not exist. Generating...");

  if (privateKeyPathIsDir) {
    fs.rmdirSync(privateKeyPath, { recursive: true });
  }

  if (publicKeyPathIsDir) {
    fs.rmdirSync(publicKeyPath, { recursive: true });
  }

  createPrivateKey(privateKeyPath)
    .then(() => {
      createPublicKey(privateKeyPath, publicKeyPath);
    })
    .then(() => {
      console.log("JWT key file successfully created.");
      process.exit(0);
    })
    .catch(error => {
      throw error;
    });
} else if (!publicKeyPathIsValid) {
  if (publicKeyPathIsDir) {
    fs.rmdirSync(publicKeyPath, { recursive: true });
  }

  createPublicKey(privateKeyPath, publicKeyPath)
    .then(() => {
      console.log("JWT key file successfully created.");
      process.exit(0);
    })
    .catch(error => {
      throw error;
    });
}
