import number2 from '../controller/country'
import generic from '../controller/generic'
import { Server } from 'restify'

export default (server: Server) => {
    server.get('/src/api/country', number2)

    server.get('/:route', generic.readAll)
    server.get('/:route/:id', generic.read)
    server.post('/:route', generic.create)
    server.put('/:route/:id', generic.update)
    server.del('/:route/:id', generic.delete)
}