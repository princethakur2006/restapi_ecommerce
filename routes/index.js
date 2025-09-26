import express from 'express';
import registerController from '../controllers/auth/registerController.js';
import loginController from '../controllers/auth/loginController.js';

const router = express.Router();

router.post('/register', registerController.register);
router.post('/login', loginController.login);


export default router;
