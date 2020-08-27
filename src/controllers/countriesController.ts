import countries from '../configs/country'
import {Country} from '../types'
import country from '../configs/country'

export const getAll =  () => {
    return  countries.map(country => {
        if (!country.hasOwnProperty('population')){
            return {
                ...country,
                population: 0
            }
        }
        return country
    })
}


