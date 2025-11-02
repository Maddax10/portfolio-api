import { Router } from 'express';
import db from '../db/database.js';
import requireAuth from '../middleware/auth.js';

const router = Router();
const uniqueConstraint = `SQLITE_CONSTRAINT_UNIQUE`;
const noDataInBDD = `No data in bdd`;

const isValidString = (s) => {
	return typeof s === 'string' && s.trim().length > 0;
};
const isValidNumber = (n) => {
	return Number.isInteger(n) && n > 0;
};

/**
 * Modifie la structure de l'objet renvoyé pour ne pas matcher avec la bdd
 * @param {*} rows
 * @returns
 */
const getData = (rows) => {
	return {
		id: rows.id_skills,
		name: rows.name_skills,
		description: rows.description_skills,
		image_path: rows.image_path_skills,
	};
};
/**==========================================================
 * GET
   ==========================================================*/
router.get('/all', requireAuth, (req, res) => {
	try {
		const rows = db.prepare(`SELECT * from skills_view`).all();

		res.json(rows);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
});

/**==========================================================
 * POST
   ==========================================================*/

/*
 * Objet attendu en body : 
  {
    "name" : "require",
    "image_path" : "require",
    "description" : "require"
  }
*/
router.post('/create', requireAuth, (req, res) => {
	const { name, image_path, description } = req.body;
	try {
		if (!name || !image_path || !description) throw new Error('champ vide ou mauvais objet envoyé');
		if (!isValidString(name) || !isValidString(image_path) || !isValidString(description)) throw new Error('champ vide ou mauvais objet envoyé');
		//.get et pas .run car on retourne tout l'objet inséré
		const rows = db.prepare(`INSERT INTO skills (name_skills, image_path_skills, description_skills) VALUES (?,?,?) RETURNING *;`).get(name, image_path, description);

		const data = getData(rows);

		return res.status(200).json(data);
	} catch (e) {
		if (e.code === uniqueConstraint) return res.status(401).json({ erreur: 'Doublons non autorisé' });
		return res.status(401).json({ erreur: e.message });
	}
});

/**==========================================================
 * PUT
   ==========================================================*/
/*
 * Objet attendu en body : 
  {
    "id" : number,
    "name" : "require",
    "image_path" : "require",
    "description" : "require"
  }
*/
router.put('/update', requireAuth, (req, res) => {
	const { id, name, image_path, description } = req.body;
	try {
		if (!id || !name || !image_path || !description) throw new Error('champ vide ou mauvais objet envoyé');
		if (!isValidNumber(id) || !isValidString(name) || !isValidString(image_path) || !isValidString(description)) throw new Error('champ vide ou mauvais objet envoyé');

		const rows = db.prepare(`update skills set name_skills = ?, image_path_skills = ?, description_skills = ? WHERE id_skills = ? RETURNING *;`).get(name, image_path, description, id);

		if (!rows) throw new Error(noDataInBDD);

		const data = getData(rows);
		return res.status(200).json(data);
	} catch (e) {
		if (e.code === uniqueConstraint) return res.status(401).json({ erreur: uniqueConstraint });
		if (e.code === noDataInBDD) return res.status(401).json({ erreur: noDataInBDD });
		return res.status(401).json({ erreur: e.message });
	}
});
/**==========================================================
 * DELETE
   ==========================================================*/
/**
 * Objet attendu :
/*
 * Objet attendu en body : 
  {
    "id" : number
  }
*/

router.delete('/delete', requireAuth, (req, res) => {
	const { id } = req.body;
	try {
		if (!id) throw new Error('champ vide ou mauvais objet envoyé');
		if (!isValidNumber(id)) throw new Error("L'id n'est pas un nombre valide");

		const rows = db.prepare(`DELETE FROM skills WHERE id_skills = ? RETURNING *;`).get(id);

		if (!rows) throw new Error(noDataInBDD);

		const data = getData(rows);
		return res.status(200).json({ delete: data });
	} catch (e) {
		if (e.code === uniqueConstraint) return res.status(401).json({ erreur: uniqueConstraint });
		if (e.code === noDataInBDD) return res.status(401).json({ erreur: noDataInBDD });
		return res.status(401).json({ erreur: e.message });
	}
});
export default router;
