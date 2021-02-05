import { IsString, IsNumber, IsIn, IsOptional } from "class-validator";

export abstract class GetCountriesQueryParams {
  @IsOptional()
  @IsIn(["asc", "desc"])
  abstract sort?: "asc" | "desc";
}

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
