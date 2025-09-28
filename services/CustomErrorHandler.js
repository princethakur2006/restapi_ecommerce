class customErrorHandler extends Error{
    constructor(status, message){
        super();
        this.status = status;
        this.message = message;
    }

    // static method => to call them we dont req to make instance of the class
    static alreadyExist(message){
        return new customErrorHandler(409, message)
    }

    static wrongCredentials(message = 'Username or password is wrong'){
        return new customErrorHandler(401, message)
    }

    static unAuthorized(message = 'unAuthorized'){
        return new customErrorHandler(401, message)
    }

    static notFound(message = '404 Not Found'){
        return new customErrorHandler(404, message)
    }

    static serverError(message = 'internal server error'){
        return new customErrorHandler(500, message)
    }
}

export default customErrorHandler;