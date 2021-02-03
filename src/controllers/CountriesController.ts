import {
  JsonController,
  Authorized,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  InternalServerError,
  Param,
  Body,
} from "routing-controllers";
import { Container } from "typedi";

import { CountriesService } from "../services/CountriesService";
import getCountriesErrorProne from "../api/country";
import {
  CreateCountryBody,
  UpdateCountryBody,
} from "./CountriesControllerValidators";

@JsonController("/countries")
export class CountriesController {
  private countries: CountriesService;

  constructor() {
    this.countries = Container.get(CountriesService);
  }

  @Authorized()
  @Get("/")
  async getAllCountries() {
    return this.countries.getCountries();
  }

  @Authorized()
  @Get("/error-prone")
  async getAllCountriesErrorProne() {
    try {
      return await getCountriesErrorProne();
    } catch (e) {
      throw new InternalServerError("Could not retrieve countries.");
    }
  }

  @Authorized()
  @Post()
  async createCountry(@Body() body: CreateCountryBody) {
    return this.countries.createCountry(body);
  }

  @Authorized()
  @Put("/:countryCode")
  async updateCountryPut(
    @Param("countryCode") countryCode: string,
    @Body() body: UpdateCountryBody,
  ) {
    return this.countries.updateCountry(countryCode, body);
  }

  @Authorized()
  @Patch("/:countryCode")
  async updateCountryPatch(
    @Param("countryCode") countryCode: string,
    @Body() body: UpdateCountryBody,
  ) {
    return this.countries.updateCountry(countryCode, body);
  }

  @Authorized()
  @Delete("/:countryCode")
  async deleteCountry(@Param("countryCode") countryCode: string) {
    return this.countries.deleteCountry(countryCode);
  }
}
