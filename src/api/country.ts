import countries from "../configs/country";
import { ICountry } from "../types";

/**
 * API to get the countries, sometimes this fails.
 *
 */
export default (): Promise<Array<ICountry>> =>
  new Promise((resolve, reject) => {
    setTimeout(
      () => (Math.round(Math.random()) === 0 ? resolve(countries) : reject()),
      100,
    );
  });
