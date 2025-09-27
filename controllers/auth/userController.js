    import { User } from "../../models/user.js";
    import customErrorHandler from "../../services/CustomErrorHandler.js";

    const userController ={
        async me(req, res, next){
            //
            try {
                const user = await User.findOne({_id:req.user._id}).select('-password -updatedAt -__v');
                
                
                if(!user){
                    return next(customErrorHandler.notFound('User not found!'));
                }

                res.json(user);
            } catch (error) {
                return next(error);
            }
        }

    };

    export default userController;