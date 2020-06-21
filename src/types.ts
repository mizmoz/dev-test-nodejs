import { IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export interface Country {
  name: string;
  code: string;
  population?: number;
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class CountryDTO {
  @IsOptional()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  population: number;
}
