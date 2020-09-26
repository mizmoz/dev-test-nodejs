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
            res.send({
                status: 500,
                message: 'Failed to retrieve countries',
                error
            });
        });
});

const compareName = (a: Country, b: Country, sort: string): number => {
    if (sort === 'asc') {
        return a.name > b.name ? 1 : -1;
    }
    return a.name < b.name ? 1 : -1;
}

export default router;