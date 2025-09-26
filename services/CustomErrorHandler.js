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
}

export default customErrorHandler;