import { Router, Request, Response } from 'express';
import countryAPI from '../api/country';
import { Country } from '../types';

import { redisClient } from '../redisClient';

const router = Router();

const COUNTRIES = 'COUNTRIES';

router.route('/').get((req: Request, res: Response) => {
    const sort: any = req.query.sort || 'asc';

    redisClient.get(COUNTRIES, (error, reply) => {
        if (error) console.log(error);

        if (reply) {
            const countries: Array<Country> = JSON.parse(reply);
            sortCountries(res, countries, sort);
        } else {
            countryAPI()
                .then(countries => {
                    setCountries(countries);
                    sortCountries(res, countries, sort);
                })
                .catch(error => {
                    res.status(500)
                        .json({
                            status: 500,
                            message: 'Failed to retrieve countries',
                            error
                        });
                });
        }
    });
});

router.route('/:code').get((req: Request, res: Response) => {
    redisClient.get(COUNTRIES, (error, reply) => {
        if (error) console.log(error);

        if (reply) {
            const countries: Array<Country> = JSON.parse(reply);
            getCountry(req, res, countries);
        } else {
            countryAPI()
                .then(countries => {
                    getCountry(req, res, countries);
                })
                .catch(error => {
                    res.status(500);
                    res.send({
                        status: 500,
                        message: 'Failed to retrieve countries',
                        error
                    });
                });
        }

    });
});

router.route('/:code').delete((req: Request, res: Response) => {
    redisClient.get(COUNTRIES, (error, reply) => {
        if (error) console.log(error);

        if (reply) {
            const countries: Array<Country> = JSON.parse(reply);
            deleteCountry(req, res, countries);
        } else {
            countryAPI()
                .then(countries => {
                    deleteCountry(req, res, countries);
                })
                .catch(error => {
                    res.status(500);
                    res.send({
                        status: 500,
                        message: 'Failed to retrieve countries',
                        error
                    });
                });
        }
    });
});

router.route('/:code').put((req: Request, res: Response) => {
    redisClient.get(COUNTRIES, (error, reply) => {
        if (error) console.log(error);

        if (reply) {
            const countries: Array<Country> = JSON.parse(reply);
            updateCountry(req, res, countries);
        } else {
            countryAPI()
                .then(countries => {
                    updateCountry(req, res, countries);
                }).catch(error => {
                    res.status(500);
                    res.send({
                        status: 500,
                        message: 'Failed to retrieve countries',
                        error
                    });
                });
        }
    });
});

const sortCountries = (res: Response, countries: Array<Country>, sort: string): void => {
    const sorted: Array<Country> = countries.sort((a: Country, b: Country) => compareName(a, b, sort));

    res.status(200).send(sorted);
}

const getCountry = (req: Request, res: Response, countries: Array<Country>): void => {
    const { code } = req.params;
    const country: Country | undefined = countries.find(c => c.code === code.toLowerCase());

    if (country) {
        res.status(200);
        res.send(country);
    } else {
        res.status(404);
        res.send({
            error: "Not Found",
            message: `Country code ${code} not found`
        });
    }
}

const updateCountry = (req: Request, res: Response, countries: Array<Country>): void => {
    const { code } = req.params;
    const { name, population } = req.body;

    const country: Country | undefined = countries.find(c => c.code === code.toLowerCase());

    if (country) {
        country.population = population;
        country.name = name;

        setCountries(countries);
        res.status(200);
        res.send({
            ...country
        });
    }
}

const deleteCountry = (req: Request, res: Response, countries: Array<Country>): void => {
    const { code } = req.params;
    const index = countries.findIndex(c => c.code === code.toLowerCase());

    if (index) {
        countries.splice(index, 1);
        setCountries(countries);
        res.sendStatus(200);
    } else {
        res.status(404);
        res.send({
            error: "Not Found",
            message: `Country code ${code} not found`
        });
    }
}

const compareName = (a: Country, b: Country, sort: string): number => {
    if (sort === 'asc') {
        return a.name > b.name ? 1 : -1;
    }
    return a.name < b.name ? 1 : -1;
}

const setCountries = (countries: Array<Country>): void => {
    // store countries when available - expires in 1440 seconds
    redisClient.setex(COUNTRIES, 1440, JSON.stringify(countries));
}

export default router;