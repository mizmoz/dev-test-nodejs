import { Body, Controller, Get, Param, Patch, Put, Query, Delete, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';
import { Country, CountryDTO, SortOrder } from './types';

@Controller('countries')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getAllCountries(
    @Query('order') order: SortOrder = SortOrder.ASC
  ): Promise<Country[]> {
    return this.appService.getCountries(order);
  }

  @Delete(':code')
  @HttpCode(204)
  async deleteCountry(@Param('code') code: string): Promise<void> {
    return this.appService.deleteCountry(code);
  }

  @Put(':code')
  async updateCountry(@Param('code') code: string, @Body() data: CountryDTO) {
    return this._updateCountry(code, data);
  }

  @Patch(':code')
  async updateCountryAndPopulation(@Param('code') code: string, @Body() data: CountryDTO) {
    return this._updateCountry(code, data);
  }

  private _updateCountry(code: string, data: CountryDTO): Promise<Country> {
    return this.appService.updateCountry(code, data);
  }
}
