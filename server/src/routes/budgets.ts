import { Router } from 'express';
import { db } from '../db';

const router = Router();

// Get all budgets
router.get('/', (req, res) => {
  try {
    const budgets = db.prepare('SELECT * FROM budgets WHERE user_id = 1').all();
    res.json(budgets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create a budget
router.post('/', (req, res) => {
  try {
    const { category, limit_amount } = req.body;
    if (!category || !limit_amount) return res.status(400).json({ error: "Missing fields" });

    // Check if a budget for this category already exists to avoid duplicates
    const existing = db.prepare('SELECT * FROM budgets WHERE user_id = 1 AND category = ?').get(category);
    if (existing) {
      return res.status(400).json({ error: "Budget for this category already exists" });
    }

    const insert = db.prepare('INSERT INTO budgets (user_id, category, limit_amount) VALUES (?, ?, ?)');
    const result = insert.run(1, category, limit_amount);
    
    res.status(201).json({ id: result.lastInsertRowid, category, limit_amount });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a budget
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleteBudget = db.prepare('DELETE FROM budgets WHERE id = ?');
    deleteBudget.run(id);
    res.json({ message: "Budget deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;