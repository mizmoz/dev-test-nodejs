import fs from "fs";
import { Service } from "typedi";
import jwt from "jsonwebtoken";

@Service()
export class AuthService {
  private privateKey: Buffer;
  private publicKey: Buffer;

  constructor(args: { privateKeyPath: string; publicKeyPath: string }) {
    this.privateKey = fs.readFileSync(args.privateKeyPath);
    this.publicKey = fs.readFileSync(args.publicKeyPath);
  }

  async signToken<T>(payload: T) {
    return new Promise<string>((resolve, reject) => {
      jwt.sign(
        { ...payload, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8 },
        this.privateKey,
        { algorithm: "RS256" },
        (err, token) => {
          if (typeof token === "undefined" || err) {
            reject(err ?? "Undefined token");
          } else {
            resolve(token);
          }
        },
      );
    });
  }

  async verifyToken<T>(token: string) {
    return new Promise<T>((resolve, reject) => {
      jwt.verify(token, this.publicKey, (err, decoded) => {
        if (typeof decoded === "undefined" || err) {
          reject(err ?? "Undefined token payload");
        } else {
          resolve((decoded as unknown) as T);
        }
      });
    });
  }
}
