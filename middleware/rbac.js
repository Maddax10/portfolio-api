import db from '../db/database.js';

export const isAdmin = (userDB) => {
  if (!userDB) return false;
  return userDB.role === 'Admin';
};
