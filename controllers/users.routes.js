import { Router } from 'express';
import db from '../db/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, BCRYPT_SALT_ROUNDS } from '../config/config.js';
import requireAuth from '../middleware/auth.js';
import { isAdmin } from '../middleware/rbac.js';
const router = Router();

const badCredentials = '❌ Identifiants invalides';
const notAdmin = '❌ not an admin';
const badParams = { error: '❌ params incorrects', body: { mail: 'string', password: 'string' } };

/**
 * Check if the user is in the bdd
 * @param {*} mail mail@mail.com
 * @returns user json from DB
 */
const getUserDB = (mail) => {
	const userDB = db.prepare('select * from login_view where mail = ?').get(mail);
	if (!userDB) {
		console.warn(`${new Date().toISOString()} | ❌ [/users/login] unknow password for [${mail}]`);
		throw new Error(badCredentials);
	}

	return userDB;
};

const CheckPassword = (password, userDB) => {
	//compareSync compare un mdp non hashé à un mdp hashé
	const isOk = bcrypt.compareSync(password, userDB.password);

	if (!isOk) {
		console.warn(`${new Date().toISOString()} | ❌ [/users/login] password inconnu pour email ${userDB.mail}`);
		throw new Error(badCredentials);
	}
};

const CheckIsAdmin = (userDB) => {
	if (!isAdmin(userDB.role)) {
		console.warn(`❌ id: ${userDB.id} | is not an admin `);
		throw new Error(notAdmin);
	}
	console.warn(`${new Date().toISOString()} | ✅ id: ${userDB.id} | is an admin'`);
};

/** GET  ============================================================ */

/** POST ============================================================ */

/**
 * Login
 *
 * Objet attendu :
    {
      email: 'mail',
      password: 'password',
    },
 */
router.post('/login', (req, res) => {
	const { mail, password } = req.body || {};
	//Si erreur dans les paramètres, indication claire
	if (mail === undefined || mail === null || password === undefined || password === null) {
		console.warn(`${new Date().toISOString()} | ❌ params incorrects`);
		return res.status(400).json(badParams);
	}

	try {
		//1) recherche et affectation de l'utilisateur pour voir s'il est trouvé
		const userDB = getUserDB(mail);
		//2) si l'utilisateur à été trouvé, alors on compare le mdp
		//on check si le password (non hashé) est le même que celui en bdd (hashé)
		CheckPassword(password, userDB);

		// //3)On vérifie que c'est un admin
		// CheckIsAdmin(userDB);

		//Création du token
		const token = jwt.sign({ sub: userDB.id, mail: userDB.mail }, JWT_SECRET, { expiresIn: '2h' });

		//Création d'un user pour éviter de renvoyer le mot de passe
		const user = {
			id: userDB.id,
			mail: userDB.mail,
			createdAt: userDB.createdAt,
			role: userDB.role,
			token,
		};
		return res.json(user);
	} catch (e) {
		if (e.message === badCredentials) return res.status(401).json({ error: e.message });
		if (e.message === notAdmin) return res.status(403).json({ error: e.message });
		return res.status(500).json({ error: e.message });
	}
});

router.get('/me', requireAuth, (req, res) => {
	const currentUserId = req.auth?.sub;
	try {
		const userDB = db.prepare('select * from users_view where id = ?').get(currentUserId);
		console.log(userDB);

		return res.status(200).json(userDB);
	} catch (error) {
		return res.status(500).json({ error: e.message });
	}
});

export default router;
