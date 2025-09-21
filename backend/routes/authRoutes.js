import express from 'express';
import * as auth from '../controllers/authController.js';

const router = express.Router();

router.post('/signup',auth.signup);
router.post('/login',auth.login);
router.post('/logout',auth.logout); 

router.post('/refresh',auth.refresh);


export { router as authRouter };
