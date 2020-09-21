import number2 from '../controller/country'
import generic from '../controller/generic'
import { Server } from 'restify'

export default (server: Server) => {
    server.get('/src/api/country', number2)

    server.get('/:route', generic.readAll)
    server.post('/:route', generic.create)
}