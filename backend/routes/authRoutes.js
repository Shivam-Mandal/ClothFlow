import express from 'express';
import * as auth from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', auth.signup);
router.post('/login', auth.login);
router.post('/logout', verifyToken, auth.logout);

router.get("/me", verifyToken, (req, res) => {
  // req.user was populated by verifyToken
  res.json({ success: true, user: req.user });
});

export { router as authRouter };
