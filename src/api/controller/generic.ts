import Model from '../model/index'
import {Request, Response, Next} from 'restify'

class GenericController {
    async create(req: Request, res: Response, next: Next) {
        const { route, token } = req.params
        const params = req.body

        console.log(params)

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

    async read(req: Request, res: Response, next: Next) {
        const { route, _id } = req.params

        const element = await Model[route].findOne({ _id })

        res.send(200, element)
        return next()
    }

    async update(req: Request, res: Response, next: Next) {
        const { route, _id } = req.params
        const params = req.body

        const element = await Model[route].findOneAndUpdate(
            { _id },
            params,
            {
                new: true
            }
        )

        res.send(200, element)
        return next()
    }

    async delete(req: Request, res: Response, next: Next) {
        const { route, _id } = req.params
        
        const { ok } = await Model[route].deleteOne({ _id })

        res.send(200, { deleted: !!ok })
        return next()
    }
}

export default new GenericController()