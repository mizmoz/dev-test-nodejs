import { IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiResponse, ApiOkResponse } from '@nestjs/swagger';

@ApiResponse({ type: ApiOkResponse })
export class Country {
  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

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
  name: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  population: number;
}
