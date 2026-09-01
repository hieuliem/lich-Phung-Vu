import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!connectionString) throw new Error('Set DATABASE_URL_UNPOOLED or DATABASE_URL before running migrations.');

const sql = neon(connectionString);
const migration = await readFile(new URL('../drizzle/0000_liturgical_library.sql', import.meta.url), 'utf8');
for (const statement of migration.split('--> statement-breakpoint').map((value) => value.trim()).filter(Boolean)) {
  await sql.query(statement);
}
console.log('Neon schema and starter data are ready.');
