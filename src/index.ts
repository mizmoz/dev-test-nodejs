import express from 'express';
import {fetchAllCountries,updateCountryData,updateCountryPopulation} from './modules/index'
import redisClient, {getCountry} from './api/redis-client'
import bodyParser from 'body-parser'
import auth from './api/authenticate'

const app = express();
const PORT = process.env.PORT || 8000
const authenticate = async (res:any,req:any, next:any)=>{
  const auths =  await auth("username","password")
  if(auths){
    next()
  }else{
    throw new Error("Wrong auth")
  }
}
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(authenticate)

app.get('/', (req,res) => res.send('Countries'));
app.get('/countries', async (req,res) =>{
    const countries = await fetchAllCountries()
    console.log(countries)
    res.send(JSON.stringify(countries))
})

app.post('/country/add', async (req, res) => {
    const value = req.body;
    const key = req.body.code
    await redisClient.setAsync(key, JSON.stringify(value));
    console.log(req.body)
    return res.send('Successfully Inserted to Redis');
});

app.post('/country/update', async (req, res) => {
  const {code, name, population} = req.body
  await updateCountryData(code,name,population)
  return res.send(`Successfully updated ${code} to Redis`);
});

app.post('/country/updatepopulation', async (req, res) => {
  const {code, population} = req.body
  await updateCountryPopulation(code,population)
  return res.send(`Successfully updated population ${code} to Redis`);
});

app.post('/country/delete',async(req,res)=>{
  const {code} = req.body
  await redisClient.delAsync(code)
  return res.send(`Successfully deleted ${code} to Redis`);
})

app.get('/country/:key', async (req, res) => {
    const { key } = req.params;
    const rawData = await getCountry(key);
    return res.json(rawData);
});

app.listen(PORT, () => {
  console.log(`server http://localhost:${PORT}`);
});
