import { IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiResponse, ApiOkResponse } from '@nestjs/swagger';

@ApiResponse({ type: ApiOkResponse })
export class Country {
  @ApiProperty()
  name: string | undefined;

  @ApiProperty()
  code: string | undefined;

  @ApiProperty()
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
  @ApiProperty({ required: false })
  public name: string | undefined;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  public population: number | undefined;
}
