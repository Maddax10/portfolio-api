# **<u>🚀 API Portfolio</u>**

API Node.js/Express avec SQLite pour exposer des projets et des compétences, avec login administrateur.

---

## **<u>🧰 Stack</u>**

- Node.js + Express
- SQLite (better-sqlite3)
- JWT (auth)
- CORS, compression gzip
- Variables d’environnement (.env)

---

## **<u>📂 Arborescence</u>**

- /controllers  
   Routes Express (auth, projets, compétences)
- /db  
   Connexion et scripts SQL (tables, vues)
- /middleware  
   Authentification JWT et RBAC
- /config  
   Chargement .env et constantes
- launch.js  
   Entrée du serveur

---

## **<u>✅ Prérequis</u>**

- Node.js LTS (≥ 18)
- npm
- Windows (OK), macOS/Linux (OK)

---

## **<u>⚙️ Installation</u>**

- Cloner le repo
- Installer les dépendances
  - `npm install`
- Créer un fichier .env (ou copier celui d’exemple)

Exemple minimal de .env:

```env
NODE_ENV=development
PORT=3000
DB_PATH=db/bdd.db
JWT_SECRET=change-moi
BCRYPT_SALT_ROUNDS=10
URL_API=localhost
```

---

## **<u>▶️ Lancement</u>**

- Démarrer le serveur
  - `node launch.js`
- Par défaut: http://localhost:3000

Astuce (optionnel): ajoutez un script npm “start”:

```json
{
	"scripts": {
		"start": "node launch.js"
	}
}
```

---

## **<u>🔌 Endpoints</u>**

- Healthcheck

  - `GET /health`
  - Réponse: `{ ok: true, started_at: ... }`

- Authentification

  - `POST /auth/login`
  - Body: `{ "mail_users": "mail", "password_users": "password" }`
  - Réponse: `{ id, mail, role, token, ... }`
  - Le token JWT (Bearer) sert pour les routes protégées.

- Compétences

  - `GET /skills/all`
  - Réponse: liste des compétences (id, name, image_path)

- Projets
  - `GET /projects/all`
  - Réponse: liste des projets (id, title, description, github, image_path, skills)
  - Le champ `skills` est renvoyé comme tableau JSON (pas une chaîne)

Exemples rapides (PowerShell ou Git Bash):

```bash
curl http://localhost:3000/health
curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d "{\"mail_users\":\"admin@mail.com\",\"password_users\":\"password\"}"
curl http://localhost:3000/skills/all
curl http://localhost:3000/projects/all
```

---

## **<u>🔐 Authentification (JWT)</u>**

- Après login, utilisez le token dans l’entête:
  - `Authorization: Bearer <token>`
- Les routes protégées utilisent le middleware d’auth: refus si token manquant ou expiré.

---

## **<u>🗄️ Données & Base SQLite</u>**

- Tables: users, roles, skills, projects
- Vues: login_view, skills_view, projects_view
- Emplacement DB: `DB_PATH` (ex: db/bdd.db)

Conseils:

- Sauvegardez le fichier .db (backup)
- Ne mettez pas le .db en public
- Ne modifiez pas directement les vues: mettez à jour les tables sources

---

## **<u>🖼️ Images: quoi stocker ?</u>**

- Simple et efficace: stocker un chemin/URL vers l’image (ex: `/images/portfolio.png`)
- Avantages: cache navigateur/CDN, BDD légère, pas de base64
- Alternative: BLOB en BDD si besoin d’atomicité ou de petites images

---

## **<u>🌐 CORS & Réseau</u>**

- CORS activé pour tous les domaines (`origin: *`)
- Adaptez-le en production (limiter au domaine du front)

---

## **<u>🧪 Tests rapides</u>**

- Vérifier que `GET /health` répond
- Vérifier `POST /auth/login` renvoie un token
- Vérifier `GET /skills/all` et `GET /projects/all` renvoient bien du JSON

---

## **<u>🛡️ Sécurité (à minima)</u>**

- Utiliser un `JWT_SECRET` fort (env prod)
- Limiter le CORS à votre front en prod
- Valider les entrées sur les routes d’écriture (si ajoutées)
- Mettre à jour les packages régulièrement

---

## **<u>🚀 Déploiement</u>**

- Définir les variables d’environnement (PORT, DB_PATH, JWT_SECRET, …)
- Exposer le port (reverse proxy: Nginx/Traefik)
- Surveiller les logs et la taille du .db

---
