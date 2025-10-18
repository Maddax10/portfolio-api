import { Router } from 'express';
import db from '../db/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, BCRYPT_SALT_ROUNDS } from '../config/config.js';
import requireAuth from '../middleware/auth.js';
import { isAdmin } from '../middleware/rbac.js';
const router = Router();

/** GET  ============================================================ */
/** POST ============================================================ */

/**
 * Login
 *
 * Objet attendu :
 * {    "mail_user" : "email@mail.com",
 *      "password_user" : "password"
 * }
 */
router.post('/login', (req, res) => {
  const { mail_users, password_users } = req.body || {};
  //Si erreur dans les paramètres, indication claire
  if (!mail_users || !password_users) return res.status(400).json({ error: 'params incorrects', body: { mail_users: 'mail', password_users: 'password' } });

  try {
    //1) recherche de l'utilisateur pour voir s'il est trouvé
    const row = db.prepare('select * from users where mail_users = ?').get(mail_users);
    if (!row) return res.status(401).json({ error: 'mail not found' });

    //check if the pass in params is the same as in bd
    let checkPass = row.password_users === password_users;

    if (!checkPass) return res.status(401).json({ error: 'Bad password' });

    return res.json(row);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;
