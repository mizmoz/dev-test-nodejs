import {Router, Request, Response} from 'express';
import countryFunction from '../api/country';
import * as Redis from '../configs/redis';

const router = Router();

router.get('/getAllCountries', async (req:Request, res:Response) => {
   let data = await Redis.getAllData();
   res.status(200).json(data);
})

router.put('/updateCountry/:code', async (req:Request, res:Response) => {
    let obj : object = req.body;
    let code : string = req.body.code;
    let client = Redis.client;
    client.set(code, JSON.stringify(obj));

    let data = await Redis.getAllData();
    res.status(200).json(data);

})

router.delete('/deleteCountry/:id', async (req:Request, res:Response) => {
    let code = req.params.id;
    let client = Redis.client;
    client.del(code);
    let data = await Redis.getAllData();
    res.status(200).json(data);
})


export = router
    
