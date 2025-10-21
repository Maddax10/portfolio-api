import { Router } from 'express';
import db from '../db/database.js';
import requireAuth from '../middleware/auth.js';

const router = Router();

router.get('/all', (req, res) => {
  try {
    const rows = db.prepare(`SELECT * from skills_view`).all();

    res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
export default router;
