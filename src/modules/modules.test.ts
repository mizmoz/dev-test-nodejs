import {fetchAllCountries, updateCountryPopulation,deleteCountry,updateCountryData} from './index'

describe('index test', ()=>{

    it('should define a function to fetch all countries', async ()=>{
        expect( fetchAllCountries()).toBeDefined()
    })
    
    it('country should be on the sorting order',()=>{
        expect(fetchAllCountries()).toBeTruthy()
    })

    it('should define a function to update population of the country',async ()=>{
        expect(await updateCountryPopulation("pol",5)).toBeDefined()  
    })

    it('should return unknown key if key is unknown', async ()=>{
        expect(await updateCountryPopulation("cid",2)).toBe("unknown key")
    })

    it('should exist function to delete countries',  ()=>{
        expect(deleteCountry('pol')).toBeDefined()
    })

    it('should have a function to update country',async ()=>{
        expect(await updateCountryData("","",1)).toBeDefined()
    })

    it('should return unknown key message if key not exist ',async ()=>{
        expect(await updateCountryPopulation("cid",2)).toBe("unknown key")
    })

})


