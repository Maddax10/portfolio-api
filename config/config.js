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
export const PORT = toNumber(process.env.PORT, 3000);

// Chemin du fichier de base de données (par défaut: db/bdd.db)
export const DB_PATH = process.env.DB_PATH || 'db/bdd.db';

// Secret utilisé pour signer les JWT (à surcharger en production)
export const JWT_SECRET = process.env.JWT_SECRET || base_jwt_secret;

// Nombre de rounds pour bcrypt (par défaut: 10)
export const BCRYPT_SALT_ROUNDS = toNumber(process.env.BCRYPT_SALT_ROUNDS, 10);

//Url de l'API
export const URL_API = process.env.URL_API || 'localhost';

// En environnement non-développement, échoue immédiatement si le JWT_SECRET est resté sur la valeur par défaut (insecure)
// Vérifie que le secret faible n'est pas utilisé hors développement
if (NODE_ENV !== 'development' && JWT_SECRET === base_jwt_secret) {
  // Lève une erreur pour forcer une configuration sécurisée
  throw new Error('Insecure JWT_SECRET. Set a strong JWT_SECRET in the environment.');
}
