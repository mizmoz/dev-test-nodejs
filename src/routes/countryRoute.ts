import { Router, Request, Response } from 'express';
import countryAPI from '../api/country';
import { Country } from '../types';

const router = Router();

router.route('/').get((req: Request, res: Response) => {
    const sort: any = req.query.sort || 'asc';

    countryAPI()
        .then(countries => {
            const sorted: Array<Country> = countries.sort((a, b) => compareName(a, b, sort));

            res.send(sorted);
        })
        .catch(error => {
            res.status(500);
            res.send({
                status: 500,
                message: 'Failed to retrieve countries',
                error
            });
        });
});

router.route('/:code').get((req: Request, res: Response) => {
    const { code } = req.params;

    countryAPI()
        .then(countries => {
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
        })
        .catch(error => {
            res.status(500);
            res.send({
                status: 500,
                message: 'Failed to retrieve countries',
                error
            });
        });
});

router.route('/:code').put((req: Request, res: Response) => {
    const { code } = req.params;
    const { name, population } = req.body;

    countryAPI()
        .then(countries => {
            const country: Country | undefined = countries.find(c => c.code === code.toLowerCase());

            if (country) {
                country.population = population;
                country.name = name;

                res.status(200);
                res.send({
                    ...country
                });
            }
        }).catch(error => {
            res.status(500);
            res.send({
                status: 500,
                message: 'Failed to retrieve countries',
                error
            });
        });;

});

const compareName = (a: Country, b: Country, sort: string): number => {
    if (sort === 'asc') {
        return a.name > b.name ? 1 : -1;
    }
    return a.name < b.name ? 1 : -1;
}

export default router;