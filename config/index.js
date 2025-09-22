import dotenv from 'dotenv';
dotenv.config();

export const {
    APP_PORT = 3000
} = process.env;