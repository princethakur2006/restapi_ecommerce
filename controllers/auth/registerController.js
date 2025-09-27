import Joi from 'joi';
import customErrorHandler from '../../services/CustomErrorHandler.js';
import {User } from '../../models/user.js';
import bcrypt from 'bcrypt'
import jwtService from '../../services/jwtService.js';
import { REFRESH_SECRET } from '../../config/index.js';
import { RefreshToken } from '../../models/refreshToken.js';

const registerController = {
    async register(req, res, next){
        // logic for registering a user


        //1. ===> validate the request body

        //first we have to create the schema for the validation 
        const registerSchema = Joi.object({
            name:Joi.string().min(3).max(30).required(), //chaining
            email:Joi.string().email().required(),
            password:Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
            repeat_password:Joi.ref('password')
        })

        const {error } = registerSchema.validate(req.body)

        if(error){
            return next(error);
        }

        // check if the user in the database already exists
        try {
            const exist = await User.exists({email:req.body.email})
            if(exist){
                // for this we make special custom error handler class
                return next(customErrorHandler.alreadyExist('This email is already taken'));
            }
        } catch (error) {
            return next(error);
        }
        
        const {name, email, password} = req.body;
        // Hash password => use bcrypt library
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // prepare the model
        

        const user = new User({
            name,
            email,
            password: hashedPassword
        });
        
        let access_token;
        let refresh_token;
        try {
            const result = await user.save();

            // token
            access_token = jwtService.sign({_id: result._id, role: result.role})

            refresh_token = jwtService.sign({_id: result._id, role: result.role}, '1y', REFRESH_SECRET)


            // database whitelist

            await RefreshToken.create({token : refresh_token});


        } catch (error) {
            return next(error);
        }

        res.json({
            access_token: access_token,
            refresh_token: refresh_token
        })
    }
}

export default registerController;
