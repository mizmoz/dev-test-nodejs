export function validationError (message: string) {
    return {
        message: message
    }
}

export function validationAuth (message: string) {
    return {
        code: 401,
        message: message
    }
}

export function validationNotFound(message: string) {
    return {
        code: 404,
        message: message
    }
}

