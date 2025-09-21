import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { authRouter } from './routes/authRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173','https://clothflow.onrender.com/'] 
  credentials: true,               
}));
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies

// Routes
app.use('/api/auth', authRouter);

// Test route
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

// Connect to DB and start server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection failed:', error);
        process.exit(1);
    });

