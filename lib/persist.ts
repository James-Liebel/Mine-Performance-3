/**
 * File-based persistence for admin-editable data.
 * Data is stored under data/persisted/*.json. Survives server restarts when the
 * process has a writable filesystem (e.g. local dev, VPS). On serverless (e.g. Vercel)
 * the filesystem may be read-only — persistence will no-op and you'll need a database.
 */

import fs from 'node:fs';
import path from 'node:path';

const DIR = path.join(process.cwd(), 'data', 'persisted');

function getPath(filename: string): string {
  return path.join(DIR, filename.endsWith('.json') ? filename : `${filename}.json`);
}

export function loadJSON<T>(filename: string): T | null {
  try {
    const p = getPath(filename);
    const raw = fs.readFileSync(p, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function saveJSON(filename: string, data: unknown): void {
  try {
    if (!fs.existsSync(DIR)) {
      fs.mkdirSync(DIR, { recursive: true });
    }
    const p = getPath(filename);
    fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // No-op if read-only FS (e.g. serverless)
  }
}
