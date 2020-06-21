import { IsDefined, IsString, IsNotEmpty, Length } from 'class-validator';

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
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  name: string;

  @IsDefined()
  @IsString()
  @Length(3)
  code: string;
}
