import { Router } from 'express';
import db from '../db/database.js';
import requireAuth from '../middleware/auth.js';

const router = Router();

router.get('/all', (req, res) => {
	try {
		const rows = db.prepare(`SELECT * from projects_view`).all();
		//Récupération d'un string qui contient du JSON donc je le parse
		const result = rows.map((r) => ({
			...r,
			skills: JSON.parse(r.skills, []),
		}));
		res.json(result);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
});
export default router;
