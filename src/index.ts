import express, { Request, Response } from "express";
import * as CountryService from './api/country';
import router from './routes/api';



const app = express();
console.log('starting express');
app.use('/', router)
app.listen(8080);
