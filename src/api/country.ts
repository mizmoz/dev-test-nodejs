import countries from "../configs/country";
import { Country } from "../types";

/**
 * API to get the countries, sometimes this fails.
 *
 */
export default (): Promise<Array<Country>> =>
  new Promise((resolve, reject) => {
    setTimeout(
      () => (Math.round(Math.random()) === 0 ? resolve(countries) : reject()),
      100,
    );
  });
