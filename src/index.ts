import express, { Request, Response } from "express";
import router from './routes/api';


const app = express();

app.use(express.json());
app.use('/', router)

app.listen(8080);
