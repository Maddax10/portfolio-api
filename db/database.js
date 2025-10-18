import Database from 'better-sqlite3';
import { DB_PATH } from '../config/config.js';

// Simpler: no conditional verbose mode; add back if needed later
const db = new Database(DB_PATH);

export default db;
