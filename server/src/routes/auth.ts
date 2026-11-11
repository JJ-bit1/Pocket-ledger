import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "All fields required" });

    const checkUser = db.prepare('SELECT * FROM users WHERE email = ?');
    const existingUser = checkUser.get(email);
    if (existingUser) return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertUser = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
    const result = insertUser.run(email, hashedPassword);

    const token = jwt.sign({ id: result.lastInsertRowid, email }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: result.lastInsertRowid, email } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkUser = db.prepare('SELECT * FROM users WHERE email = ?');
    const user: any = checkUser.get(email);

    if (!user) return res.status(400).json({ error: "User not found" });
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;