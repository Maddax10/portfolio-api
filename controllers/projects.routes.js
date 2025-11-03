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

const isPlainObject = (obj) => {
	return obj != null && typeof obj === 'object' && Object.getPrototypeOf(obj) === Object.prototype;
};
/**
 *	Check if the skillsObj have the good structure and id type
 *	{
		id:Number
	}
 * @param {*} skillsObj
 * @returns
 */
const isValidIdSkillsArray = (skillsObj) => {
	let countValidObj = false;
	skillsObj.map((skill) => (countValidObj += isPlainObject(skill) && typeof skill.id === 'number'));
	return countValidObj === skillsObj.length;
};
/**
 * Modifie la structure de l'objet renvoyé pour ne pas matcher avec la bdd
 * @param {*} rows
 * @returns
 */
const getData = (rows) => {
	return {
		title: rows.title_projects,
		description: rows.description_projects,
		github: rows.github_projects,
		image_path: rows.image_path_projects,
		skills: rows.skills_projects,
	};
};

/**==========================================================
 * GET
   ==========================================================*/

router.get('/all', requireAuth, (req, res) => {
	try {
		//Je récupère tous les projects
		const rows = db.prepare(`SELECT * from projects_view`).all();
		//Récupération d'un string qui contient du JSON donc je le parse
		const projects = rows.map((project) => ({
			...project,
			skills: JSON.parse(project.skills, []),
		}));

		//je récupère tous les skills
		const allSkills = db.prepare(`select * from skills_view`).all();
		//je créé un dictionnaire par id de ces skills
		const byId = new Map(allSkills.map((s) => [s.id, s]));

		//J'enrichie mes projects avec les skills
		const enrichedProjects = projects.map((project) => ({
			...project,
			skills: project.skills.map((skill) => byId.get(skill.id)),
		}));

		res.json(enrichedProjects);
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
    "title" : "require",
    "description" : "require",
    "github" : "require",
    "image_path" : "require",
    "skills" : "require"
  }
*/
router.post('/create', requireAuth, (req, res) => {
	const { title, description, github, image_path, skills } = req.body;
	try {
		if (!title || !description || !github || !image_path || !skills) throw new Error('champ vide ou mauvais objet envoyé');
		if (!isValidString(title) || !isValidString(description) || !isValidString(github) || !isValidString(image_path) || !isValidString(skills)) throw new Error('champ vide ou mauvais objet envoyé');

		const rows = db.prepare(`INSERT INTO projects (title_projects, description_projects, github_projects, image_path_projects, skills_projects) VALUES (?,?,?,?,?) RETURNING *;`).get(title, description, github, image_path, skills);
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
    "title" : "reqdusire",
    "description" : "require",
    "github" : "require",
    "image_path" : "require",
    "skills" : "require"
  }
*/
router.put('/update', requireAuth, (req, res) => {
	const { id, title, description, github, image_path, skills } = req.body;
	try {
		if (!id || !title || !description || !github || !image_path || !skills) throw new Error('champ vide ou mauvais objet envoyé');
		if (!isValidNumber(id) || !isValidString(title) || !isValidString(description) || !isValidString(github) || !isValidString(image_path) || !isValidIdSkillsArray(skills)) throw new Error('champ vide ou mauvais objet envoyé');
		// JSON.stringify([skills]) => laisser en tableau, structure bdd
		const rows = db.prepare(`update projects set title_projects = ?, description_projects = ?, github_projects = ?,  image_path_projects = ?, skills_projects = ? WHERE id_projects = ? RETURNING *;`).get(title, description, github, image_path, JSON.stringify(skills), id);

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

		const rows = db.prepare(`DELETE FROM projects WHERE id_projects = ? RETURNING *;`).get(id);

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
