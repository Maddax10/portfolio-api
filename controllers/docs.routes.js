import { Router } from 'express';

const router = Router();

export const routes = [
	// health
	{ ________________: 'health' },
	{ method: 'GET', path: '/health' },

	// auth & users
	// users (admin-only list)
	{ ________________: 'Auth & users' },
	{
		method: 'POST',
		path: '/login',
		jsonObject: {
			email: 'mail',
			password: 'password',
		},
	},
	// Projects
	{ ________________: 'Projects' },
	{
		method: 'GET',
		path: '/projects/all',
	},
	// Skills
	{ ________________: 'Skills' },
	{
		method: 'GET',
		path: '/skills/all',
	},
];

//A la racine de "/doc"
router.get('/', (_req, res) => {
	return res.status(200).json(routes);
});

export default router;
