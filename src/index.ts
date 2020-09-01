import express from 'express'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'

import MainRouter from './router';

//declare express app
const app: express.Application = express();

const PORT = process.env.PORT || 5000
 
 
//default middleware config
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
 
app.use('/api', MainRouter.getRouter());

app.listen(PORT, () => {
  console.log(`Server is running`);
})