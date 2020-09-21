import {Request, Response, Next} from 'restify'
import country from '../country'

export default
    (req: Request, res: Response, next: Next) => 
        country()
        .then(countries => {
            res.send(countries)
            next()
        })
        .catch(err => {
            next(new Error('Something went wrong.'))
        })