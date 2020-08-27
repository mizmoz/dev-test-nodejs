import { IncomingMessage, ServerResponse } from "http";
import * as countries from './controllers/countriesController'


const routes: any = {
    '/': countries.getAll
}

export default (req: IncomingMessage, res: ServerResponse) => {

    try {
        res.setHeader('Content-Type', 'application/json');
        if (!req.url || !routes[req.url]) throw "Invalid url"

        const object = routes[req.url]()
        res.end(JSON.stringify(object));

    } catch (e) {
        res.end(JSON.stringify({ error: '404' }));

    }


    // switch (req.url) {
    //     case '/':
    //         if (req.method === 'GET') {
    //             res.end(JSON.stringify(countries));
    //         }
    //     default:
    //         res.end(JSON.stringify({ error: '404' }));
    // }

}