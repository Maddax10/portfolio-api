import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js';

// Simple JWT auth middleware shared across routers
export const requireAuth = (req, res, next) => {
  try {
    const auth = req.headers['authorization'] || '';
    const parts = auth.split(' ');
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

export default requireAuth;
