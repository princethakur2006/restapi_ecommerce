import { JWT_SECRET } from "../config/index.js";
import jwt from 'jsonwebtoken'; 

class jwtService {
    static sign(payload, expiry = '60s', secret = JWT_SECRET) {
        return jwt.sign(payload, secret, {expiresIn: expiry});
    }
}

export default jwtService;