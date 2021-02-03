import { IsString, IsNumber, IsOptional } from "class-validator";

export abstract class CreateCountryBody {
  @IsString()
  abstract code: string;

  @IsString()
  abstract name: string;

  @IsOptional()
  @IsNumber()
  abstract population?: number;
}

export abstract class UpdateCountryBody {
  @IsOptional()
  @IsString()
  abstract name?: string;

  @IsOptional()
  @IsNumber()
  abstract population?: number;
}
