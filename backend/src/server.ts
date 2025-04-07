import express from 'express';
import groupRoutes from './routes/group.routes';
import expenseRoutes from './routes/expense.routes';
import summaryRoutes from './routes/summary.routes';
import connectDB from './config/db';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cookieParser());


app.use(cors({ origin: 'http://localhost:5173' ,credentials: true,
}));
app.use('/api/auth', groupRoutes);
app.use('/expenses', expenseRoutes);
app.use('/summary', summaryRoutes);
app.use('/api/auth', authRoutes);

connectDB();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;








