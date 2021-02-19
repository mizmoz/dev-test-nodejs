import express, { Request, Response } from 'express';
import promiseRetry from 'promise-retry'
import promisedCountries from '../api/country'

const router = express.Router()

router.get('/', (req: Request, res: Response) => {
    promiseRetry((retry: any, numberOfAttemps: any) => {
        // tslint:disable-next-line: no-console
        console.log('attempt number', numberOfAttemps);

        return promisedCountries()
            .catch(retry);
    })
        .then((counries: any) => {
            res.send(counries)
        }, (err: any) => {
            res.sendStatus(500).send(err)
        });
})

router.get('/:country_code', (req: Request, res: Response) => {
    const code = req.params.country_code
    promiseRetry((retry: any, numberOfAttemps: any) => {
        // tslint:disable-next-line: no-console
        console.log('attempt number', numberOfAttemps);

        return promisedCountries()
            .catch(retry);
    })
        .then((counries: any) => {
            res.send(counries.find((el: { code: string; }) => el.code === code))
        }, (err: any) => {
            res.sendStatus(500).send(err)
        });
})
export default router