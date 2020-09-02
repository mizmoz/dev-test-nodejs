import cors from 'cors';
import express from 'express';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import countryService from './services/countryService';
import authService from './services/authService';

dotenv.config();

if (!process.env.PORT) {
  console.log(`Error in getting port.`);
    process.exit(1);
 }

 const PORT: number = parseInt(process.env.PORT as string, 10);
 
 const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

app.use('/api/countries', countryService);
app.use('/api/auth', authService);

const server = app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}.`);
});
