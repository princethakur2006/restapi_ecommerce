

import mongoose from 'mongoose'

const schema = mongoose.Schema;


const productSchema = new schema({
    name:{type:String, required:true},
    price:{type:Number, required:true},
    size:{type:String, required:true},
    image:{type:String, required:true}
}, {timestamps:true});


export const Product =  mongoose.model('Product', productSchema, );