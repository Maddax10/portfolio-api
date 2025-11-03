# ****🚀 API Portfolio****

API simple pour exposer des projets et des compétences, avec authentification admin, basée sur Node.js, Express et SQLite.

---

## ****🧰 Stack technique****

- Node.js + Express
- SQLite (better-sqlite3)
- Authentification JWT
- CORS + compression gzip

---

## ****✅ Prérequis****

- Node.js LTS (≥ 18)
- npm
- Windows, macOS ou Linux

---

## ****⚙️ Installation****

- Cloner le projet
- Installer les dépendances  
   `npm install`

---

## ****🗝️ Configuration (.env)****

- Créer un fichier `.env` à la racine (ou copier celui d’exemple)

```env
NODE_ENV=development
PORT=3000
DB_PATH=db/bdd.db
DB_VERBOSE=false
JWT_SECRET=change-moi-en-production
BCRYPT_SALT_ROUNDS=10
URL_FRONT=localhost
```

---

## ****▶️ Démarrage****

- Lancer le serveur  
   `node launch.js`

- Optionnel (ajouter dans package.json)

```json
{
	"scripts": {
		"start": "node launch.js"
	}
}
```

- Puis lancer  
   `npm start`

---

## ****📂 Structure du projet****

- /controllers  
   Routes Express (docs, users/auth, skills, projects)
- /db  
   Connexion + scripts SQL (tables, vues)
- /middleware  
   Auth JWT et rôles
- /config  
   Chargement variables d’env
- launch.js  
   Entrée du serveur

---

## ****🗄️ Base de données****

- Fichier SQLite: défini par `DB_PATH` (ex: `db/bdd.db`)
- Tables: `users`, `roles`, `skills`, `projects`
- Vues:
  - `login_view` (auth)
  - `skills_view`
  - `projects_view` (inclut `skills` en JSON texte)
- Remarque: `projects.skills` est stocké en texte JSON en BDD et renvoyé en tableau par l’API.

---

## ****🔌 Endpoints principaux****

- Healthcheck

  - `GET /health`
  - Réponse: `{ ok: true, started_at: "..." }`

- Documentation (JSON)

  - `GET /docs/`

- Authentification

  - `POST /auth/login`
  - Body:
    ```json
    { "mail_users": "admin@mail.com", "password_users": "votre-mot-de-passe" }
    ```
  - Réponse: objet utilisateur + `token` (JWT)
  - Utilisation du token sur routes protégées:  
     `Authorization: Bearer <token>`

- Compétences

  - `GET /skills/all`
  - Réponse: tableau d’objets `{ id, name, image_path }`

- Projets
  - `GET /projects/all`
  - Réponse: tableau d’objets `{ id, title, description, github, image_path, skills }`
  - `skills` est un tableau (parsé depuis le JSON stocké en BDD)

---

## ****🧪 Exemples rapides (curl)****

- Health  
   `curl http://localhost:3000/health`

- Login (retourne un token)  
   `curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d "{\"mail_users\":\"admin@mail.com\",\"password_users\":\"password\"}"`

- Skills  
   `curl http://localhost:3000/skills/all`

- Projects  
   `curl http://localhost:3000/projects/all`

---

## ****🔐 Sécurité****

- Utiliser un `JWT_SECRET` fort en production
- Restreindre CORS à votre domaine front en prod
- Ne pas exposer le fichier `.db`
- Sauvegarder régulièrement la base

---

## ****🖼️ Gestion des images****

- Recommandé: stocker en BDD un chemin/URL (ex: `/images/portfolio.png`) et servir les fichiers statiquement (ou via CDN)
- Avantages: BDD légère, cache navigateur/CDN, performance
- Alternative: stocker l’image en BLOB si besoin spécifique

---

## ****🚀 Déploiement****

- Définir les variables d’environnement (PORT, DB_PATH, JWT_SECRET, …)
- Utiliser un reverse proxy (Nginx/Traefik)
- Activer les logs et surveiller la taille du fichier `.db`

---

## ****🛠️ Dépannage****

- 401 sur routes protégées
  - Vérifier l’en-tête `Authorization: Bearer <token>`
- Erreurs BDD
  - Vérifier `DB_PATH` et la présence des tables/vues
- `skills` apparaît “avec des backslash” en console
  - C’est normal en BDD (texte JSON). L’API parse et renvoie un vrai tableau.
