import Joi from "joi";
import { User } from "../../models/user.js";
import customErrorHandler from "../../services/CustomErrorHandler.js";
import bcrypt from 'bcrypt';
import jwtService from "../../services/jwtService.js";

const loginController = {
    async login(req, res, next) {
        // validation logic
        const loginSchema = Joi.object({
            email:Joi.string().email().required(),
            password:Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
        })

        const {error } = loginSchema.validate(req.body)

        if(error){
            return next(error); 
        }

        try {
            const user = await  User.findOne({email:req.body.email});
            if(!user){
                return next(customErrorHandler.wrongCredentials());
            }
            //compare the password
            const match = await bcrypt.compare(req.body.password, user.password);

            if(!match){
                return next(customErrorHandler.wrongCredentials());
            }

            //token
            const access_token = jwtService.sign({_id: user._id, role: user.role})
            res.json({access_token: access_token});// if login is successful
        } catch (error) {
            return next(error);
        }
        
        
    }

};

export default loginController; 