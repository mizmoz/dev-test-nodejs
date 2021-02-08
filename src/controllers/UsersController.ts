import {
  JsonController,
  Post,
  Body,
  UnauthorizedError,
  InternalServerError,
} from "routing-controllers";
import { Container } from "typedi";

import authenticate from "../api/authenticate";
import { AuthService } from "../services/AuthService";
import { LoginBody } from "./UsersControllerValidators";

@JsonController("/users")
export class UsersController {
  private auth: AuthService;

  constructor() {
    this.auth = Container.get(AuthService);
  }

  @Post("/login")
  async login(@Body() { username, password }: LoginBody) {
    const authenticated = await authenticate(username, password);

    if (!authenticated) {
      throw new UnauthorizedError("Invalid username/password.");
    }

    try {
      const accessToken = await this.auth.signToken<{ username: string }>({
        username,
      });

      return { accessToken };
    } catch (e) {
      console.error(e);
      throw new InternalServerError("Could not authenticate user.");
    }
  }
}
