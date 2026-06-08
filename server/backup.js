import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'orders.db');
const BACKUP_DIR = path.join(__dirname, '..', 'data', 'backups');

export function backupDatabase() {
  if (!fs.existsSync(DB_PATH)) {
    console.error('Database file not found:', DB_PATH);
    return;
  }

  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, `orders-${timestamp}.db`);
  fs.copyFileSync(DB_PATH, backupPath);
  console.log('Database backed up to:', backupPath);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  backupDatabase();
}
