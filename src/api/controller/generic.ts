import Model from '../model/index'
import {Request, Response, Next} from 'restify'

class GenericController {
    async create(req: Request, res: Response, next: Next) {
        const { route, token } = req.params
        const params = req.body

        console.log(params)
        //const { username } = await UserTransformer.verifyToken(token)

        //let temp = `${username && username.length ? username: 'Nobody'} created something!`

        const element = await Model[route].create(params)

        res.send(200, { element })
        return next()
    }

    async readAll(req: Request, res: Response, next: Next) {
        
        const { 
            route,
            sort = 'created_at',
            direction = 'asc'
        } = req.params

        let elements = await Model[route].find()

        elements = elements.sort((a: any, b: any) => {
            let sort_value
    
            if(typeof a[sort] === 'string')
                sort_value = (direction === 'asc')
                    ? a[sort].localeCompare(b[sort]) 
                    : b[sort].localeCompare(a[sort])
            else
                sort_value = (direction === 'asc')
                    ? a[sort] - b[sort]
                    : b[sort] - a[sort]
    
            return sort_value
        })

        res.send(elements)
        return next()
    }
}

export default new GenericController()