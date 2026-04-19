export function successResponse(body){
    return {
        success: true,
        statusCode: 200,
        body: body
    }
}

export function errorResponse(error){
    return {
        success: false,
        statusCode: 500,
        body: error.message
    }
}

export function notFoundResponse(body){
    return {
        success: false,
        statusCode: 404,
        body: body
    }
}