import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js';
import isAdmin from './rbac.js';

// JWT only for admin
export const requireAuthAdmin = (req, res, next) => {
  try {
    const auth = req.headers['authorization'] || '';
    const parts = auth.split(' ');
    //Check token
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'missing or invalid Authorization header' });
    }
    const token = parts[1];
    const payload = jwt.verify(token, JWT_SECRET);
    //Admin check
    if (!isAdmin(payload.mail)) return res.status(403).json({ error: "You're not Admin !" });
    req.auth = payload; // { sub, mail, iat, exp }
    next();
  } catch (e) {
    return res.status(401).json({ error: 'invalid or expired token' });
  }
};
// JWT only for admin and guest
export const requireAuth = (req, res, next) => {
  try {
    const auth = req.headers['authorization'] || '';
    const parts = auth.split(' ');
    //Check token
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'missing or invalid Authorization header' });
    }
    const token = parts[1];
    const payload = jwt.verify(token, JWT_SECRET);
    req.auth = payload; // { sub, mail, iat, exp }
    next();
  } catch (e) {
    return res.status(401).json({ error: 'invalid or expired token' });
  }
};

export default requireAuthAdmin;
