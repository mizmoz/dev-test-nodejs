import {
  ICountry,
  ICountryUpdateType,
  IPopulation,
  ISort,
} from '../types';

export default class Country {
  private redis: any;

  constructor(redis: any) {
    this.redis = redis;
  }

  public getCountries() {
    return this.redis.getCountries();
  }

  public getCountriesSortedByPopulation(sort: ISort) {
    return this.redis.getCountries().then((countries: ICountry) => {
      const countriesPop = countries as unknown as IPopulation[];
      countriesPop.sort((a, b) => {
        let pop1 = a.population;
        let pop2 = b.population;

        pop1 = !pop1 ? 0 : pop1;
        pop2 = !pop2 ? 0 : pop2;

        if (sort.order === 'desc') {
          return pop1 < pop2 ? 1 : -1;
        }
        return pop1 > pop2 ? 1 : -1;
      });

      return countriesPop;
    });
  }

  public updateCountry(countryToUpdate: IPopulation, updateType?: ICountryUpdateType) {
    let countryUpdateType: ICountryUpdateType = { type:'country'}; // Default
    if (updateType && updateType.type) {
      countryUpdateType = updateType;
    }

    return this.redis.getCountries().then((countries: ICountry) => {
      const countriesPop = countries as unknown as IPopulation[]; // ZZZZ
      const { type } = countryUpdateType;
      let hasChanges = false;

      for (let i = 0; countriesPop.length > i; i++) {
        if (countriesPop[i].code === countryToUpdate.code) {
          // Update population
          if (type === 'population' && countriesPop[i].population !== countryToUpdate.population) {
            countriesPop[i].population = countryToUpdate.population;
            hasChanges = true;
            break;
          }

          // Update country
          if (type === 'country' && countriesPop[i].name !== countryToUpdate.name) {
            countriesPop[i].name = countryToUpdate.name;
            hasChanges = true;
            break;
          }
        }
      }

      // Update data on redis
      if (hasChanges) { // Prevent from updating without changes
        this.redis.updateCountryList(countriesPop);
      }

      return countriesPop;
    });
  }

  public deleteCountry(countryToDelete: IPopulation) {
    return this.redis.getCountries().then((countries: ICountry) => {
      const countriesPop = countries as unknown as IPopulation[]; // ZZZZ

      // Identify index to delete
      let idxToDel: number | undefined;
      for (let i = 0; countriesPop.length > i; i++) {
        if (countriesPop[i].code === countryToDelete.code) {
          idxToDel = i;
          break;
        }
      }

      // Remove the object from list and update data on redis
      if (idxToDel !== undefined) { // Prevent from updating without changes
        countriesPop.splice(idxToDel, 1);
        this.redis.updateCountryList(countriesPop);
      }

      return countriesPop;
    });
  }
}
