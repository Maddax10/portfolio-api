// Importe la librairie dotenv pour gérer les variables d'environnement via un fichier .env
import dotenv from 'dotenv';

const base_jwt_secret = 'dev-secret';

// Charge les variables d'environnement depuis .env (n'a aucun effet si le fichier .env est absent)
dotenv.config();

// NOTE: toNumber doit être disponible (utilitaire externe) pour convertir des chaînes en nombres avec valeur par défaut
// Minimal helper
const toNumber = (v, fallback) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
};

// Définit l'environnement d'exécution (par défaut: 'development')
export const NODE_ENV = process.env.NODE_ENV || 'development';

// Définit le port HTTP de l'application (par défaut: 3000), converti en nombre
export const PORT = toNumber(process.env.VITE_PORT, 3001);

// Chemin du fichier de base de données (par défaut: db/bdd.db)
export const DB_PATH = process.env.DB_PATH || 'db/bdd.db';

// Secret utilisé pour signer les JWT (à surcharger en production)
export const JWT_SECRET = process.env.JWT_SECRET || base_jwt_secret;

// Nombre de rounds pour bcrypt (par défaut: 10)
export const BCRYPT_SALT_ROUNDS = toNumber(process.env.BCRYPT_SALT_ROUNDS, 10);

export const URL_FRONT = process.env.URL_FRONT || 'undefined';
export const URL_API = process.env.VITE_API_URL || 'undefined';
export const URL_ENDPOINT = process.env.VITE_ENDPOINT || 'undefined';
export const URL_PORT = process.env.VITE_PORT || 'undefined';

//images
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const BASE_PATH = __dirname || 'undefined';

// En environnement non-développement, échoue immédiatement si le JWT_SECRET est resté sur la valeur par défaut (insecure)
// Vérifie que le secret faible n'est pas utilisé hors développement
if (NODE_ENV !== 'development' && JWT_SECRET === base_jwt_secret) {
    // Lève une erreur pour forcer une configuration sécurisée
    throw new Error('Insecure JWT_SECRET. Set a strong JWT_SECRET in the environment.');
}
