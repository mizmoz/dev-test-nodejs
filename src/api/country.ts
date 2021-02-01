import countries from "../configs/country"
import { Country } from "../types"

export default (): Promise<Array<Country>> => {
    return new Promise((resolve, reject) => {
      countries ? resolve(countries) : reject()
    })
  }