import db from '../db/database.js';

export const isAdmin = (userId) => {
  if (!userId) return false;
  const row = db.prepare('SELECT role_user FROM users WHERE _id_user = ?').get(userId);
  return row?.role_user === 'admin';
};
