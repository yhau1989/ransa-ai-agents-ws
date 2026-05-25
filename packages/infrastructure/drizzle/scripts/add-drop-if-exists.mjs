import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const migrationsDir = join(process.cwd(), 'migrations');
const tableName = 'form_submissions';
const dropStmt = `DROP TABLE IF EXISTS "${tableName}" CASCADE;\n\n`;

const latestSql = readdirSync(migrationsDir)
  .filter((f) => f.endsWith('.sql'))
  .sort()
  .at(-1);

if (!latestSql) {
  console.log('No SQL migrations found. Skipping drop-table patch.');
  process.exit(0);
}

const filePath = join(migrationsDir, latestSql);
const content = readFileSync(filePath, 'utf8');

if (content.startsWith(dropStmt)) {
  console.log(`Drop statement already present in ${latestSql}`);
  process.exit(0);
}

writeFileSync(filePath, `${dropStmt}${content}`, 'utf8');
console.log(`Prepended DROP TABLE IF EXISTS to ${latestSql}`);
