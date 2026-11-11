import { Router } from 'express';
import { db } from '../db';

const router = Router();

// Get all expenses
router.get('/', (req, res) => {
  try {
    // Hardcoding user_id = 1 for demo purposes
    const expenses = db.prepare('SELECT * FROM expenses WHERE user_id = 1').all();
    res.json(expenses);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new expense
router.post('/', (req, res) => {
  try {
    const { amount, category, date } = req.body;
    if (!amount || !category) {
      return res.status(400).json({ error: "Amount and category are required" });
    }

    const insert = db.prepare('INSERT INTO expenses (user_id, amount, category, date) VALUES (?, ?, ?, ?)');
    const result = insert.run(1, amount, category, date || new Date().toISOString());
    
    res.status(201).json({ 
      id: result.lastInsertRowid, 
      amount, 
      category, 
      date 
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
// DELETE an expense
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleteExpense = db.prepare('DELETE FROM expenses WHERE id = ?');
    deleteExpense.run(id);
    res.json({ message: "Expense deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE an expense
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category } = req.body;
    
    const updateExpense = db.prepare('UPDATE expenses SET amount = ?, category = ? WHERE id = ?');
    updateExpense.run(amount, category, id);
    
    res.json({ message: "Expense updated" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
export default router;