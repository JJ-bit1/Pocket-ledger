import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { dbPath } from './db';
import authRoutes from './routes/auth';
import expenseRoutes from './routes/expenses';
import budgetRoutes from './routes/budgets';

// 1. Create the app FIRST
const app = express();
const PORT = process.env.PORT || 5000;

// 2. Add middleware
app.use(cors());
app.use(express.json());

// 3. THEN add the routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);

// 4. Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 5. Start the server
app.listen(PORT, () => {
  console.log(`Pocket-Ledger API listening on port ${PORT}`);
  console.log(`Database: ${dbPath}`);
});