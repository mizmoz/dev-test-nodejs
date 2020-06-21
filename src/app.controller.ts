import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Put, Query } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags, ApiNoContentResponse, ApiNotFoundResponse, ApiAcceptedResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Country, CountryDTO, SortOrder } from './types';

@Controller('countries')
@ApiTags('countries')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @ApiOperation({ summary: 'Get Countries sorted by population' })
  @ApiQuery({ name: 'order', enum: SortOrder })
  @ApiOkResponse({ type: [Country], description: 'List of Countries ordered as requested' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Get()
  async getAllCountries(
    @Query('order') order: SortOrder = SortOrder.ASC
  ): Promise<Country[]> {
    return this.appService.getCountries(order);
  }

  @ApiOperation({ summary: 'Reset list of countries to base data' })
  @ApiNoContentResponse({ description: 'Reset request accepted' })
  @Get('reset')
  @HttpCode(204)
  async resetCountryList() {
    return this.appService.resetCountries();
  }

  @ApiOperation({ summary: 'Delete country by country code' })
  @ApiNoContentResponse({ description: 'Deletion request accepted' })
  @ApiNotFoundResponse({ description: 'Country not found' })
  @Delete(':code')
  @HttpCode(204)
  async deleteCountry(@Param('code') code: string): Promise<void> {
    return this.appService.deleteCountry(code);
  }

  @ApiOperation({ summary: 'Update by country code' })
  @ApiAcceptedResponse({ type: Country, description: 'Update successful' })
  @ApiNotFoundResponse({ description: 'Country not found' })
  @HttpCode(202)
  @Put(':code')
  async updateCountry(@Param('code') code: string, @Body() data: CountryDTO): Promise<Country> {
    return this._updateCountry(code, data);
  }

  @ApiOperation({ summary: 'Update by country code' })
  @ApiAcceptedResponse({ type: Country, status: 202, description: 'Update successful' })
  @ApiNotFoundResponse({ description: 'Country not found' })
  @HttpCode(202)
  @Patch(':code')
  async updateCountryAndPopulation(@Param('code') code: string, @Body() data: CountryDTO) {
    return this._updateCountry(code, data);
  }

  private _updateCountry(code: string, data: CountryDTO): Promise<Country> {
    return this.appService.updateCountry(code, data);
  }
}
