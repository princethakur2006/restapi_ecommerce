

import mongoose from 'mongoose'

const schema = mongoose.Schema;


const refreshTokenSchema = new schema({
    token: {type: String, unique: true},
}, {timestamps:false});


export const RefreshToken =  mongoose.model('RefreshToken', refreshTokenSchema, 'refresh-tokens');