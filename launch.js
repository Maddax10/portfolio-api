/**
 * Importations
 */
//Package
import express from 'express';
import cors from 'cors';
import compression from 'compression';

// config
import { PORT, URL_FRONT, URL_API } from './config/config.js';

//Routes
import docsRoutes from './controllers/docs.routes.js';
import usersRoutes from './controllers/users.routes.js';
import skillsRoutes from './controllers/skills.routes.js';
import projectsRoutes from './controllers/projects.routes.js';

// Swagger
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// Config Swagger (OpenAPI 3)
const swaggerOptions = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Portfolio API',
      version: '1.0.0',
      description: 'Documentation de l’API Portfolio',
    },
    servers: [{ url: URL_API.replace(/\/$/, '') }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Authentification' },
      { name: 'Users', description: 'Utilisateurs' },
      { name: 'Projects', description: 'Endpoints des projets' },
      { name: 'Skills', description: 'Gestion des compétences' },
    ],
  },
  apis: ['./controllers/**/*.js'], // JSDoc @swagger dans tes routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const app = express();

// Response compression (gzip) for faster JSON transfer
app.use(compression({ threshold: 1024 }));

const START_TIME = new Date().toISOString();
const BUILD_INFO = { started_at: START_TIME };

app.use(express.json());
app.use(
  cors({
    origin: '*', //Ou mettre URL_FRONT(de .env) pour être sur que ça ne vient que du front
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
app.get('/api/health', (_req, res) => res.json({ ok: true, ...BUILD_INFO }));
//Documentation de l'API
// app.use('/api/docs/', docsRoutes);

// Documentation Swagger (UI)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

//
app.use('/api/users/', usersRoutes);
app.use('/api/skills/', skillsRoutes);
app.use('/api/projects/', projectsRoutes);

// Root: show API documentation summary instead of login form (frontend not served here)

app.listen(PORT, () => {
  console.log(`Server running at ${URL_API}`);
});
