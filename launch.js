/**
 * Importations
 */
//Package
import express from 'express';
import cors from 'cors';
import compression from 'compression';

// config
import { PORT, URL_API } from './config/config.js';

//Routes
import docsRoutes, { routes as documentedRoutes } from './controllers/docs.routes.js';
import usersRoutes from './controllers/users.routes.js';
import skillsRoutes from './controllers/skills.routes.js';
import projectsRoutes from './controllers/projects.routes.js';

const app = express();
// Response compression (gzip) for faster GeoJSON / JSON transfer
app.use(compression({ threshold: 1024 }));

const START_TIME = new Date().toISOString();
const BUILD_INFO = { started_at: START_TIME };

app.use(express.json());
app.use(
	cors({
		origin: '*', //Ou mettre l'ip du front pour être sur que ça ne vient que de chez lui
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	})
);

/**
 *
 * Routes
 *
 */
// Health (unique)
app.get('/health', (_req, res) => res.json({ ok: true, ...BUILD_INFO }));
//Documentation de l'API
app.use('/docs/', docsRoutes);
//
app.use('/auth/', usersRoutes);
app.use('/skills/', skillsRoutes);
app.use('/projects/', projectsRoutes);

// Root: show API documentation summary instead of login form (frontend not served here)
app.get('/', (_req, res) => {
	res.status(200).json({ name: 'Portfolio API', routes: documentedRoutes });
});

app.listen(PORT, () => {
	console.log(`Server running at ${URL_API}:${PORT}`);
});
