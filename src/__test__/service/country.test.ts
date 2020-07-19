import Country from '../../services/country';

describe('Country test', () => {
  it('should have appropriate properties', () => {
    const country = new Country({});
    expect(country).toHaveProperty('getCountries');
    expect(country).toHaveProperty('getCountriesSortedByPopulation');
    expect(country).toHaveProperty('updateCountry');
    expect(country).toHaveProperty('deleteCountry');
    
  });

  it('should return value for getCountries', async () => {
    const mockData = { val: 'someval' };
    const mockedRedis = { getCountries: () => mockData };
    const country = new Country(mockedRedis);
    expect(await country.getCountries()).toEqual(mockData);
  });
});
