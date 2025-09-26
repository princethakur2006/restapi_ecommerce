// import debug mode from the config 
import {DEBUG_MODE} from '../config/index.js'
import joi from 'joi';
import customErrorHandler from '../services/CustomErrorHandler.js';

const {ValidationError} = joi; // we will use this to check if the error is instance of validation error

const errorHandler = (err, req, res, next)=>{
    let statusCode = 500;
    let data ={
        message:'internal server error',
        ...(DEBUG_MODE === 'true' && {originalError: err.message})
    }

    if(err instanceof ValidationError){ 
        //And we get the instance of  error => (error that we get which is passed in register controller)
        statusCode = 422;
        data = {
            message: err.message
        }
    }

    if (err instanceof customErrorHandler){
        statusCode = err.status;
        data = {
            message: err.message
        }   
    }

    return res.status(statusCode).json(data)

}

export default errorHandler