import countries from "../configs/country";
import { Country } from "../type";

/**
 * API to get the countries, sometimes this fails.
 *
 */
export default (): Promise<Array<Country>> =>
  new Promise((resolve, reject) => {
    setTimeout(
     // () => (Math.round(Math.random()) === 0 ? resolve(countries) : reject()),
     () =>  resolve(countries),
      100,
    );
  });
