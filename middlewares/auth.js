import customErrorHandler from "../services/CustomErrorHandler.js";
import jwtService from "../services/jwtService.js";

const auth = async (req, res, next)=>{
    let authHeader = req.headers.authorization;

    if(!authHeader){
        return next(customErrorHandler.unAuthorized());
    }

    const token = authHeader.split(' ')[1];

    try {
        const {_id, role} = await jwtService.verify(token);
        // req.user = {}
        // req.user._id = _id;
        // req.user.role = role;

        //    ======>    OR Second Way <=======  \\
        const user = {
            _id,
            role
        };
        
        
        // ✅ Assign req.user BEFORE calling next
        req.user = user;
        next();

        
    }    catch (error) {
        return next(customErrorHandler.unAuthorized());
    }

}

export default auth;