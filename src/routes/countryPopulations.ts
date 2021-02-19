import express, { Request, Response } from 'express';
import * as repository from '../repository/countryPopulationsRepository'

const router = express.Router()

router.get('/:country_code', async (req: Request, res: Response) => {
    try {
        const code = req.params.country_code
        const countryPopulation = await repository.findByCountryCode(code)

        res.json(countryPopulation != null ? Number.parseInt(countryPopulation, 10) : null)
    } catch (error) {
        res.sendStatus(500).json({ error })
    }
})

router.get('/', async (req: Request, res: Response) => {
    try {
        const countryPopulations = await repository.findAll()
        const countryPopulationsAsArray = Object.keys(countryPopulations).map(key => ({country: key, population: countryPopulations[key]}))
        const countryPopulationsAsArraySortedByPopulation = countryPopulationsAsArray.sort((a: any, b: any) => (a.population > b.population ? 1 : -1));
        
        res.json(countryPopulationsAsArraySortedByPopulation)
    } catch (error) {
        res.sendStatus(500).json({ error })
    }
})

router.post('/', async (req: Request, res: Response) => {
    // create or update
    try {
        const added = await repository.save(req.body)
        res.json({ added })
    } catch (error) {
        res.sendStatus(500).json({ error })
    }
})

router.delete('/:country_code', async (req: Request, res: Response) => {
    try {
        const code = req.params.country_code
        const deleted = await repository.remove(code)

        res.json({ deleted })
    } catch (error) {
        res.sendStatus(500).json({ error })
    }
})

export default router