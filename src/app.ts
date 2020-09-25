import express from 'express';
import * as bodyParser from 'body-parser';
import countries from './api/country';

const app = express();
const c = countries();

app.use(bodyParser.json({
    limit: '50mb',
    verify(req: any, res, buf, encoding) {
        req.rawBody = buf;
    }
}));

/*
* A routine was suppose to be implemented here on "/" to check if there us data cached on redis
* if none it will get the data from config country.ts and use those data
* to get population data from 	http://data.unhcr.org/api/population/countries.json?instance_id=country
* and store this data in redis
*/
app.get('/', (req, res) => res.send('Hello World!'));

app.get('/fetchall', async (req,res) => {
    res.send( await c);
    console.dir(c);
});

app.get('/showpopulation', async (req,res) => {
    res.send('retrieving population');
});

app.get('/updatepopulation', async (req,res) => {
    res.send('updating population');
});

app.get('/updatecountry', async (req,res) => {
    res.send('update country');
});

app.get('/deletecountry', async (req,res) => {
    res.send('delete country');
});

export {app};