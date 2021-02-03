import { IsString } from "class-validator";

export abstract class LoginBody {
  @IsString()
  abstract username: string;

  @IsString()
  abstract password: string;
}
