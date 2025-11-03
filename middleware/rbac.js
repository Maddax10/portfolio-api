import db from '../db/database.js';

const admin = `Admin`;

export const isAdmin = (mail) => {
  const roleDB = db.prepare(`select role from users_view where mail = ?`).get(mail);
  return roleDB.role === admin;
};

export default isAdmin;
