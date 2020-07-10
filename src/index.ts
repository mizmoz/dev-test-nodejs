import express from 'express';
import helmet from 'helmet';
import expressWinston from 'express-winston';
import winston from 'winston';
import { UNAUTHORIZED, INTERNAL_SERVER_ERROR } from 'http-status-codes';

import countryRoutes from './routes/country';
import authenticate from './api/authenticate';

import * as redis from './entities/redis';

(async () => {
  const logger = winston.createLogger({
    format: winston.format.simple(),
    transports: [
      new winston.transports.File({ filename: 'combined.log', }),
    ],
  });

  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
  }

  try {
    await redis.connect();

    const port = process.env.PORT || 8080;
    const app = express();

    app.use(helmet());
    app.use(express.urlencoded({
      extended: true,
    }));
    app.use(express.json());

    app.use(expressWinston.logger({
      transports: [
        new winston.transports.File({ filename: 'combined.log', }),
      ],
      format: winston.format.combine(
        winston.format.json()
      ),
    }));

    app.use(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const { authorization, } = req.headers;

      const credentials = authorization?.split('Basic ')[1];

      if (credentials) {
        const [
          username,
          password,
        ] = Buffer.from(credentials, 'base64')
          .toString()
          .split(':');
        const authorizedAccess = await authenticate(username, password);

        if (authorizedAccess) {
          next();
          return;
        }
      }

      res.status(UNAUTHORIZED).json({
        message: 'Unauthorized access.',
      });
    });

    app.use('/countries', countryRoutes);

    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.error(err.stack);

      res.status(INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong.',
      });
    });

    app.listen(port, () => {
      logger.info(`App is now running on port ${port}.`);
    });
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
})();
