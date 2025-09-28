import { Product } from "../models/product.js"
// we are not using multer here as a amiddleware we are using it as a middleware
import multer from "multer";
import path from 'node:path';
import customErrorHandler from "../services/CustomErrorHandler.js";
import Joi from 'joi'   
import fs from 'node:fs'
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appRoot = path.resolve(__dirname);


// strorage define
const storage = multer.diskStorage({
    destination:(req, file, cb)=>cb(null, 'uploads/'),
    filename:(req, file, cb)=>{
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
})


const handleMultiPartData= multer({storage, limits:{fileSize: 1000000*5}}).single('image') // 5 mb


const productController = {
    async store(req, res, next){
        // multipart form data for image upload     
        handleMultiPartData(req, res, async (err)=>{
            if(err){
                return next(customErrorHandler.serverError(err.message))
            }
            //console.log(req.file);
            
            const filePath = req.file.path
        // validation logic
        const productSchema = Joi.object({
            name:Joi.string().required(),
            price:Joi.number().required(),
            size: Joi.string().required(),

            
        })

        const {error } = productSchema.validate(req.body)

        if(error){
            // delete the uploaded file if validation is failed 
            fs.unlink(`${appRoot}/${filePath}`, (err)=>{
                if(err){
                    return next(customErrorHandler.serverError(err.message))
                }
            });    

            return next(error);
        }


        const {name, price, size} = req.body;


        let document;

        try {
            document = await Product.create({
                name,
                price,
                size,
                image: filePath
            })
        } catch (error) {
            return next(error)
        }



        res.status(201).json({document})

        })

    }
}

export default productController;