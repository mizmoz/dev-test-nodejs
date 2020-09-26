import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import countryRoute from './routes/countryRoute';
import { basicAuth } from './middlewares/auth';

const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send({
        message: 'Node Dev Test',
        author: 'delwynb'
    });
});

// middlewares
app.use(basicAuth);

// routes
app.use('/country', countryRoute);

export { app };