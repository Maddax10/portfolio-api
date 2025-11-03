/**
 * @swagger
 * components:
 *   schemas:
 *     Skill:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 3 }
 *         name: { type: string, example: "Vite" }
 *         description: { type: string, example: "Environnement de développement Front-End" }
 *         image_path: { type: string, example: "/logos/Vite_Dev_logo.svg" }
 *     Project:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 1 }
 *         title: { type: string, example: "Portfolio - React" }
 *         description: { type: string, example: "Mon portfolio" }
 *         github: { type: string, format: uri, example: "https://github.com/user/repo" }
 *         image_path: { type: string, example: "/images/portfolio.png" }
 *         skills:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Skill'
 */

import { Router } from 'express';
import db from '../db/database.js';
import requireAuthAdmin from '../middleware/auth.js';

const router = Router();
const uniqueConstraint = `SQLITE_CONSTRAINT_UNIQUE`;
const noDataInBDD = `No data in bdd`;

const allSkills = db.prepare(`select * from skills_view`).all();
const byId = new Map(allSkills.map((skill) => [skill.id, skill]));

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
  let countValidObj = 0;
  if (typeof skillsObj !== 'object') return false;
  skillsObj.map((skill) => ((countValidObj += isPlainObject(skill) && typeof skill.id === 'number') + !skill ? 1 : 0));

  return countValidObj === skillsObj.length;
};

const getJsonObjectSkills = (project) => {
  //Prendre l'id et ajouter les informations des skills dans
  project.skills = JSON.parse(project.skills);

  project.skills = project.skills.map((skill) => byId.get(skill.id));

  return project;
};
/**
 * Modifie la structure de l'objet renvoyé pour ne pas matcher avec la bdd
 * @param {*} project
 * @returns
 */
const getData = (project) => {
  return {
    id: project.id_projects,
    title: project.title_projects,
    description: project.description_projects,
    github: project.github_projects,
    image_path: project.image_path_projects,
    skills: project.skills_projects,
  };
};

/**==========================================================
 * GET
   ==========================================================*/
/**
 * @swagger
 * /projects/all:
 *   get:
 *     summary: Récupérer tous les projets
 *     tags: [Projects]
 *     security : []
 *     responses:
 *       '200':
 *         description: Liste des projets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: Object
 *                 $ref: '#/components/schemas/Project'
 */
router.get('/all', (req, res) => {
  try {
    //Je récupère tous les projects
    const rows = db.prepare(`SELECT * from projects_view`).all();
    //Récupération d'un string qui contient du JSON donc je le parse
    const projects = rows.map((project) => ({
      ...project,
      skills: JSON.parse(project.skills, []),
    }));

    //je récupère tous les skills
    //je créé un dictionnaire par id de ces skills
    //J'enrichie mes projects avec les skills
    const enrichedProjects = projects.map((project) => ({
      ...project,
      skills: project.skills.map((skill) => byId.get(skill.id)),
    }));

    return res.status(200).json(enrichedProjects);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**==========================================================
 * POST
   ==========================================================*/
/**
 * @swagger
 * /projects/create:
 *   post:
 *     summary: Créer un project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Le titre du projet.
 *                 example: mon projet
 *               description:
 *                 type: string
 *                 description: La description du projet.
 *                 example: description du projet
 *               github:
 *                 type: string
 *                 description: Le répo github du projet.
 *                 example: https://github.com/user/repo
 *               image_path:
 *                 type: string
 *                 description: Le chemin relatif de l'image du projet.
 *                 example: /images/projet.jpg
 *               skills:
 *                 type: [object,object,...]
 *                 description: Les skills du projet.
 *                 example: [{"id":1}]
 *     responses:
 *       '200':
 *         description: Récupéré le projet créé
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Project'
 */
router.post('/create', requireAuthAdmin, (req, res) => {
  const { title, description, github, image_path, skills } = req.body;
  try {
    if (!title || !description || !github || !image_path || !skills) throw new Error('champ vide ou mauvais objet envoyé');
    if (!isValidString(title) || !isValidString(description) || !isValidString(github) || !isValidString(image_path) || !isValidIdSkillsArray(skills)) throw new Error('champ vide ou mauvais objet envoyé');

    const rows = db.prepare(`INSERT INTO projects (title_projects, description_projects, github_projects, image_path_projects, skills_projects) VALUES (?,?,?,?,?) RETURNING *;`).get(title, description, github, image_path, JSON.stringify(skills));

    const project = getData(rows);
    const projectSkillObject = getJsonObjectSkills(project);

    return res.status(200).json(projectSkillObject);
  } catch (e) {
    if (e.code === uniqueConstraint) return res.status(401).json({ erreur: 'Doublons non autorisé' });
    return res.status(401).json({ erreur: e.message });
  }
});
/**==========================================================
 * PUT
   ==========================================================*/
/**
 * @swagger
 * /projects/update:
 *   put:
 *     summary: Mettre à jour un projet
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *                 description: L'index du projet.
 *                 example: 1
 *               title:
 *                 type: string
 *                 description: Le titre du projet.
 *                 example: mon projet
 *               description:
 *                 type: string
 *                 description: La description du projet.
 *                 example: description du projet
 *               github:
 *                 type: string
 *                 description: Le répo github du projet.
 *                 example: https://github.com/user/repo
 *               image_path:
 *                 type: string
 *                 description: Le chemin relatif de l'image du projet.
 *                 example: /images/projet.jpg
 *               skills:
 *                 type: [object,object,...]
 *                 description: Les skills du projet.
 *                 example: [{"id":1}]
 *     responses:
 *       '200':
 *         description: Récupérer le projet modifié
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Project'
 */
router.put('/update', requireAuthAdmin, (req, res) => {
  const { id, title, description, github, image_path, skills } = req.body;
  try {
    if (!id || !title || !description || !github || !image_path || !skills) throw new Error('champ vide ou mauvais objet envoyé');
    if (!isValidNumber(id) || !isValidString(title) || !isValidString(description) || !isValidString(github) || !isValidString(image_path) || !isValidIdSkillsArray(skills)) throw new Error('champ vide ou mauvais objet envoyé');
    // JSON.stringify([skills]) => laisser en tableau, structure bdd
    const rows = db.prepare(`update projects set title_projects = ?, description_projects = ?, github_projects = ?,  image_path_projects = ?, skills_projects = ? WHERE id_projects = ? RETURNING *;`).get(title, description, github, image_path, JSON.stringify(skills), id);

    if (!rows) throw new Error(noDataInBDD);

    const project = getData(rows);
    const projectSkillObject = getJsonObjectSkills(project);

    console.warn('Modification du projet : ', projectSkillObject);
    return res.status(200).json(projectSkillObject);
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
 * @swagger
 * /projects/delete:
 *   delete:
 *     summary: Supprimer un projet
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *                 description: L'index du projet.
 *                 example: 3
 *     responses:
 *       '200':
 *         description: Récupérer le projet supprimé
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Project'
 */
router.delete('/delete', requireAuthAdmin, (req, res) => {
  const { id } = req.body;
  try {
    if (!id) throw new Error('champ vide ou mauvais objet envoyé');
    if (!isValidNumber(id)) throw new Error("L'id n'est pas un nombre valide");

    const rows = db.prepare(`DELETE FROM projects WHERE id_projects = ? RETURNING *;`).get(id);

    if (!rows) throw new Error(noDataInBDD);

    const project = getData(rows);
    const projectSkillObject = getJsonObjectSkills(project);

    return res.status(200).json({ deleted: projectSkillObject });
  } catch (e) {
    if (e.code === uniqueConstraint) return res.status(401).json({ erreur: uniqueConstraint });
    if (e.code === noDataInBDD) return res.status(401).json({ erreur: noDataInBDD });
    return res.status(401).json({ erreur: e.message });
  }
});
export default router;
