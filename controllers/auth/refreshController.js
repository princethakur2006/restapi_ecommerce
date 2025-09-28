import Joi from 'joi';
import { RefreshToken } from '../../models/refreshToken.js';
import customErrorHandler from '../../services/CustomErrorHandler.js';
import jwtService from '../../services/jwtService.js';
import { REFRESH_SECRET } from '../../config/index.js';
import { User } from '../../models/user.js';

const refreshController = {
    async refresh(req, res, next){
        //validate the request 
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required(),
        })

        const {error }= refreshSchema.validate(req.body);

        if(error){
            return next(error);
        }
       


        // check the refresh token in the database
        let refreshtoken;
        try {
            refreshtoken = await RefreshToken.findOne({
                token: req.body.refresh_token
            })

            if(!refreshtoken){
                return next(customErrorHandler.unAuthorized('invalid refresh token'))
            }
            
            let userId;
            try {
                const {_id} = await jwtService.verify(refreshtoken.token, REFRESH_SECRET);
                userId = _id;
            } catch (error) {
                return next(customErrorHandler.unAuthorized('invalid refresh token'))
            }

            const user = await User.findOne({
                    _id: userId
            })

            if(!user){
                return next(customErrorHandler.unAuthorized('no user found'));
            }

            // tokens

            //token
            const access_token = jwtService.sign({_id: user._id, role: user.role})
             
            
            const refresh_token = jwtService.sign({_id: user._id, role: user.role}, '1y', REFRESH_SECRET)

            // database whitelist 

            await RefreshToken.create({token : refresh_token})
            
            res.json({
                access_token: access_token,
                refresh_token: refresh_token

            });


        } catch (error) {
            return next(new Error( `Something went wrong ${error.message}`))
        }
    }

};

export default refreshController;