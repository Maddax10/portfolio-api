import db from '../db/database.js';

export const isAdmin = (role) => {
	return role === 'Admin';
};
