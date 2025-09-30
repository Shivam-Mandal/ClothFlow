// routes/styles.js
import express from 'express';
import { getStyles, createStyle, deleteStyle } from '../controllers/styleController.js';
import {verifyToken} from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get('/', verifyToken, getStyles);
router.post('/', verifyToken, createStyle); // expects JSON body
router.delete('/:id', verifyToken, deleteStyle);

export { router as styleRouter };
