import { Router } from 'express';
import db from '../db/database.js';
import requireAuth from '../middleware/auth.js';
import fs from 'fs';
//Images
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { BASE_PATH } from '../config.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();

router.get('/', (req, res) => {
    const path = BASE_PATH + '/public/images';
    __dirname;
    const files = fs.readdirSync(path);
    console.log(files.length + ' fichiers');
    res.status(201).json(files.map((file) => 'images/' + file));
});
export default router;
