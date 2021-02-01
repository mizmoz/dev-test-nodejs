import apiAuth from './authenticate'
import { validationAuth } from '../errorResponse'

export default async (authorization:string) => {
    const auth : string = authorization

    if (!auth) throw validationAuth('Basic authorization is required.')

    const b64Auth: string = auth.split(' ')[1]
    const plainAuth: string = Buffer.from(b64Auth, 'base64').toString('ascii')

    const username: string = plainAuth.split(':')[0]
    const password: string = plainAuth.split(':')[1]

    const isAuthenticated: Boolean = await apiAuth(username, password)

    if (!isAuthenticated) throw validationAuth('Invalid user credentials.') 
}