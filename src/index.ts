import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import { createConnection } from "typeorm";

import Routes from "./routes";

createConnection().then(async connection => {

    const app = express();

    // middlewares
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());
    
    // set routes
    app.use("/", Routes);
    
    // start server
    const PORT= process.env.PORT || 3000;
    
    app.listen(PORT, () => {
        console.log(`Server is up and running on http://localhost:${PORT}`);
    });
    
}).catch(error => console.log(error));
