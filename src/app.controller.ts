import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { SortOrder } from './types';

@Controller('countries')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getAllCountries(
    @Query('order') order: SortOrder = SortOrder.ASC
  ): Promise<any> {
    return this.appService.getCountries(order);
  }
}
