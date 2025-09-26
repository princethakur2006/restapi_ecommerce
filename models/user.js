

import mongoose from 'mongoose'

const schema = mongoose.Schema;


const userSchema = new schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    role:{type:String, default:'customer'}
}, {timestamps:true});


export const User =  mongoose.model('User', userSchema, 'users');// third parameter is optional, it is the collection name in the database