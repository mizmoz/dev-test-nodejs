import countries from "../configs/country";
import { Country } from "../types";

/**
 * API to get the countries, sometimes this fails.
 *
 */
const addPopulation = (countriesObject:any)=>{
   return countriesObject.map((country:any)=>{
        const population = Math.floor(Math.random() * 100000)
        const value = {...country,population};
        return value
    })
        
}
export default (): Promise<Array<Country>> =>
  new Promise((resolve, reject) => {
    setTimeout(
      () => (Math.round(Math.random()) === 0 ? 
      resolve(
        addPopulation(countries)
        ) : reject()),
      100,
    );
  });
